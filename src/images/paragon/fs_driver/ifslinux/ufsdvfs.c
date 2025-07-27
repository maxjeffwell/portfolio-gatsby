// <copyright file="ufsdvfs.c" company="Paragon Software Group">
// EXCEPT WHERE OTHERWISE STATED, THE INFORMATION AND SOURCE CODE CONTAINED
// HEREIN AND IN RELATED FILES IS THE EXCLUSIVE PROPERTY OF PARAGON SOFTWARE
// GROUP COMPANY AND MAY NOT BE EXAMINED, DISTRIBUTED, DISCLOSED, OR REPRODUCED
// IN WHOLE OR IN PART WITHOUT EXPLICIT WRITTEN AUTHORIZATION FROM THE COMPANY.
//
// Copyright (c) 1994-2025 Paragon Software Group, All rights reserved.
//
// UNLESS OTHERWISE AGREED IN A WRITING SIGNED BY THE PARTIES, THIS SOFTWARE IS
// PROVIDED "AS-IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
// PARTICULAR PURPOSE, ALL OF WHICH ARE HEREBY DISCLAIMED. IN NO EVENT SHALL THE
// AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF NOT ADVISED OF
// THE POSSIBILITY OF SUCH DAMAGE.
// </copyright>
/*++

Module Name:

    ufsdvfs.c

Abstract:

    This module implements VFS entry points for
    UFSD-based Linux filesystem driver.

Author:

    Ahdrey Shedel

Revision History:

    27/12/2002 - Andrey Shedel - Created

    Since 29/07/2005 - Alexander Mamaev

--*/

//
// This field is updated by SVN
//
const char s_FileVer[] = "$Id: ufsdvfs.c 345155 2023-12-08 13:25:41Z mamaev $";

//
// Tune ufsdvfs.c
//

//#define UFSD_BUILTINT_UTF8          "Use builtin utf8 code page"
#ifdef UFSD_DEBUG
#define UFSD_DEBUG_ALLOC            "Track memory allocation/deallocation"
#endif

#ifndef UFSD_SMART_DIRTY_SEC
  #define UFSD_SMART_DIRTY_SEC  5
#endif

#include <linux/version.h>
#include <linux/kernel.h>
#include <linux/blkdev.h>
#include <linux/buffer_head.h>
#include <linux/exportfs.h>
#include <linux/fiemap.h>
#include <linux/fileattr.h>
#include <linux/freezer.h>
#include <linux/fs.h>
#include <linux/module.h>
#include <linux/mpage.h>
#include <linux/nls.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/statfs.h>
#include <linux/vmalloc.h>
#include <linux/vmstat.h>
#include <linux/writeback.h>
#include <linux/posix_acl_xattr.h>
#include <linux/xattr.h>
#include <asm/div64.h>

#include "config.h"
#include "ufsdapi.h"
#include "vfsdebug.h"
#include "ufsdjnl.h"

#if defined UFSD_NTFS
  #define UFSD_CLOSE_AT_RELEASE  "Close ufsd objects at release. Experimental feature (ntfs only)"
#endif

#if defined CONFIG_NLS && !defined UFSD_BUILTINT_UTF8
  #define UFSD_USE_NLS  "Use nls functions instead of builtin utf8 to convert strings"
#endif

#ifndef __clang__
#ifdef UFSD_BUILTINT_UTF8
#pragma message "Use builtin utf8 code page"
#endif
#ifdef CONFIG_DEBUG_MUTEXES
#pragma message "CONFIG_DEBUG_MUTEXES is ON"
#define mutex_destroy mutex_destroy_jnl
#endif
#pragma message "PAGE_SHIFT=" __stringify(PAGE_SHIFT)
#pragma message "THREAD_SIZE=" __stringify(THREAD_SIZE)
#endif


#if !defined UFSD_NTFS  && !defined UFSD_HFS  \
 && !defined UFSD_EXFAT && !defined UFSD_FAT \
 && (defined UFSD_REFS1 || defined UFSD_REFS34 || defined UFSD_REFS3 )\
 && !defined UFSD_BTRFS && !defined UFSD_APFS && !defined UFSD_XFS \
 && THREAD_SIZE < UFSD_MIN_REFS_RO_STACK
  #error "Refs requires 16K+ stack"
#endif

#if defined( CONFIG_PAGE_PINNER ) && defined( UFSD_ANDROID_KERNEL )
// -> jnl
void ufsd_put_page(struct page *page);
#undef put_page
#define put_page ufsd_put_page
#endif

// -> jnl
ssize_t ufsd_write_sync(struct kiocb *iocb, ssize_t count);

//
// Default trace level for many functions in this module
//
#define Dbg  UFSD_LEVEL_VFS

//
// driver features
//
const char s_DriverVer[] = PACKAGE_VERSION
#ifdef PACKAGE_TAG
   " " PACKAGE_TAG
#endif
#ifdef UFSD_BUILD_HOST
  ", paragon"
#endif
#if !defined __LP64__ && !defined CONFIG_LBD && !defined CONFIG_LBDAF
  ", LBD=OFF"
#endif
#if defined CONFIG_FS_POSIX_ACL
  ", acl"
#endif
  ", sd2(" __stringify(UFSD_SMART_DIRTY_SEC) ")"
#ifdef UFSD_DEBUG
  ", debug"
#elif defined UFSD_TRACE
  ", tr"
#endif
#ifdef CONFIG_DEBUG_MUTEXES
  ", dm"
#endif
#ifdef UFSD_CLOSE_AT_RELEASE
  ", car"
#endif
  ;

#define lock_ufsd(s)     _lock_ufsd( s, __func__ )
#define try_lock_ufsd(s)  _try_lock_ufsd( s, __func__ )
#define unlock_ufsd(s)   _unlock_ufsd( s, __func__ )

#ifdef UFSD_TRACE
DEBUG_ONLY( static unsigned long WaitMutex; )
static unsigned long StartJiffies;

///////////////////////////////////////////////////////////
// fname
//
// gets the name of inode (if any)
///////////////////////////////////////////////////////////
static const char *fname_(struct inode *i, char *buf, int buf_size)
{
  struct dentry *de = d_find_alias( i );

  if (de) {
    spin_lock(&de->d_lock);
    snprintf(buf, buf_size, "r=%lx, \"%s\"", i->i_ino, de->d_name.name);
    spin_unlock(&de->d_lock);
    dput(de);
  } else {
    snprintf(buf, buf_size, "r=%lx", i->i_ino);
  }

  buf[buf_size - 1] = 0;
  return buf;
}
#define fname( i, buf ) fname_( i, buf, sizeof(buf) )
#endif

#define LOG2OF_PAGES_PER_MB ( 20 - PAGE_SHIFT )

#define debug_lockdep_rcu_enabled debug_lockdep_rcu_enabled_jnl

//
// This function returns UFSD's handle for 'inode'
//
// ufsd_file* UFSD_FH( IN struct inode *inode );
//
#define UFSD_FH(i)      (UFSD_U(i)->ufile)

#define UFSD_SB(sb)     ((usuper*)(sb)->s_fs_info)
#define UFSD_VOLUME(sb) UFSD_SB(sb)->ufsd

#define UFSD_SBI_FLAGS_DISRCARD_BIT   1
#define UFSD_SBI_FLAGS_SHUTDOWN_BIT   2
#define ufsd_forced_shutdown( sbi ) test_bit( UFSD_SBI_FLAGS_SHUTDOWN_BIT, &(sbi)->flags )

//
// This function returns 'unode' for 'inode'
//
// struct unode* UFSD_U( IN struct inode* inode );
//
#define UFSD_U(inode)   (container_of((inode), struct unode, i))

//
// Private superblock structure.
// Stored in super_block.s_fs_info
//
typedef struct usuper {
    struct super_block *sb;             // sometimes useful
    UINT64            dev_size;         // size of block device in bytes
    UINT64            max_block;        // size of block device in blocks
    UINT64            end_of_dir;       // End of directory
    ufsd_volume       *ufsd;
    unsigned long     flags;              // UFSD_SBI_FLAGS_XXX ...
    struct mutex      api_mutex;
    spinlock_t        nocase_lock;
    mount_options     options;
    struct backing_dev_info *bdi;         // bdi on mount. Used to check for surprise remove
    unsigned int      bdev_blocksize_mask;
#ifdef CONFIG_FS_POSIX_ACL
    void              *x_buffer;
    size_t            bytes_per_xbuffer;
#endif

#if UFSD_SMART_DIRTY_SEC
    rwlock_t            state_lock;        // Protect the various scalars
    wait_queue_head_t   wait_done_flush;
    wait_queue_head_t   wait_exit_flush;
    struct task_struct  *flush_task;       // Pointer to the current flush thread for this volume
    struct timer_list   flush_timer;       // The timer used to wakeup the flush thread
    unsigned char       exit_flush_timer;  // Used to exit from flush thread
    unsigned long       last_dirty;
#endif
    unsigned char       bdirty;

#if defined CONFIG_PROC_FS
    struct proc_dir_entry *procdir;
#endif
    TRACE_ONLY( struct sysinfo    sys_info; ) // to save stack
    spinlock_t        ddt_lock;           // do_delayed_tasks lock
    struct list_head  clear_list;         // List of inodes to clear
    struct list_head  write_list;         // List of inodes to write

#ifdef UFSD_USE_READ_WRITE
    #define RW_BUFFER_SIZE  (16*PAGE_SIZE)
    void              *rw_buffer;         // RW_BUFFER_SIZE
#endif
    UINT64            maxbytes;           // Maximum size for normal files
    UINT64            maxbytes_sparse;    // Maximum size for sparse file

    UINT64            cluster_mask_inv;   // ~(bytes_per_cluster-1)
    unsigned int      cluster_mask;       // bytes_per_cluster-1
    unsigned int      bytes_per_cluster;
    unsigned int      discard_granularity;
    UINT64            discard_granularity_mask_inv; // ~(discard_granularity_mask_inv-1)

    finfo            *fi;

#ifdef UFSD_DEBUG
    int               eject;             // emulate ejected
    size_t            nDelClear;
    size_t            nDelWrite;
    size_t            nWrittenBlocks;
    size_t            nReadBlocks;
    size_t            nBufHit;
    size_t            nWrittenBlocksNa;
    size_t            nReadBlocksNa;
    size_t            nMappedBh;
    size_t            nUnMappedBh;
    size_t            nPeakMappedBh;
    size_t            nHashCalls;
    size_t            nHashCallsUfsd;
    size_t            nCompareCalls;
    size_t            nCompareCallsUfsd;

    spinlock_t        prof_lock;      // protect below members

    // Internal profiler
    size_t            bdunmap_meta_sync;
#endif
    atomic_t          writeiter_cnt;
    atomic_t          dirty_pages_count; // number of dirty pages
    atomic_t          VFlush;       // Need volume flush

} usuper;


#define UFSD_UNODE_FLAG_LAZY_INIT_BIT   2
#define UFSD_UNODE_FLAG_SPARSE_BIT      9   // <ufsd> file is sparsed
#define UFSD_UNODE_FLAG_COMPRESS_BIT    11  // <ufsd> file is compressed
#define UFSD_UNODE_FLAG_ENCRYPT_BIT     14  // <ufsd> file is encrypted
#define UFSD_UNODE_FLAG_DEDUP_BIT       16  // <ufsd> file is deduplicated
#define UFSD_UNODE_FLAG_STREAMS_BIT     28  // <ufsd> file contains streams
#define UFSD_UNODE_FLAG_EA_BIT          29  // <ufsd> file contains extended attributes
//#define UFSD_UNODE_FLAG_RESIDENT_BIT    30  // <ufsd> file is resident

#define UFSD_UNODE_FLAG_SPARSE    (1u<<UFSD_UNODE_FLAG_SPARSE_BIT)
#define UFSD_UNODE_FLAG_COMPRESS  (1u<<UFSD_UNODE_FLAG_COMPRESS_BIT)
#define UFSD_UNODE_FLAG_ENCRYPT   (1u<<UFSD_UNODE_FLAG_ENCRYPT_BIT)
#define UFSD_UNODE_FLAG_DEDUP     (1u<<UFSD_UNODE_FLAG_DEDUP_BIT)
#define UFSD_UNODE_FLAG_STREAMS   (1u<<UFSD_UNODE_FLAG_STREAMS_BIT)
#define UFSD_UNODE_FLAG_EA        (1u<<UFSD_UNODE_FLAG_EA_BIT)
//#define UFSD_UNODE_FLAG_RESIDENT  (1u<<UFSD_UNODE_FLAG_RESIDENT_BIT)

#define UFSD_UNODE_FLAG_API_FLAGS (UFSD_UNODE_FLAG_SPARSE | UFSD_UNODE_FLAG_COMPRESS | UFSD_UNODE_FLAG_ENCRYPT | UFSD_UNODE_FLAG_EA | UFSD_UNODE_FLAG_DEDUP)//| UFSD_UNODE_FLAG_RESIDENT)

//
// In memory ufsd inode
//
typedef struct unode {
  rwlock_t      rwlock;

  //
  // 'init_once' initialize members [0 - 'ufile')
  // 'ufsd_alloc_inode' resets members ['ufile' - 'i')
  //
  ufsd_file     *ufile;

  // one saved fragment. protected by rwlock
  loff_t        vbo, lbo, len;
  // valid size. protected by rwlock
  loff_t        valid;
  unsigned int  fpr; // fragment properties

  unsigned long flags;                // UFSD_UNODE_FLAG_XXX bits

  // Flag and fields for storing of uid / gid / mode in "no access rules" mode
  char          stored_noacsr;
  umode_t       i_mode;
  kuid_t        i_uid;
  kgid_t        i_gid;

  struct timespec64 i_crtime; // create time

  atomic_t      i_opencount;          // number of success opens

  //
  // vfs inode
  //
  struct inode  i;

} unode;


#ifdef UFSD_USE_SPARSE
  static inline int is_sparsed( IN const unode *u ) { return FlagOn( u->flags, UFSD_UNODE_FLAG_SPARSE ); }
  static inline int is_compressed( IN const unode *u ) { return FlagOn( u->flags, UFSD_UNODE_FLAG_COMPRESS ); }
  static inline int is_sparsed_or_compressed( IN const unode *u ) { return FlagOn( u->flags, UFSD_UNODE_FLAG_SPARSE | UFSD_UNODE_FLAG_COMPRESS ); }
  static inline int is_encrypted( IN const unode *u ) { return FlagOn( u->flags, UFSD_UNODE_FLAG_ENCRYPT ); }
  // -1 - sparse, -2 - resident, -3 - compressed, -4 - encrypted
  static inline int is_lbo_ok( IN const UINT64 lbo ) { return lbo < ((UINT64)-4); }
#else
  #define is_sparsed( u )  0
  #define is_compressed( u ) 0
  #define is_sparsed_or_compressed( u ) 0
  #define is_encrypted( u ) 0
  #define is_lbo_ok( lbo ) 1
#endif

#ifdef UFSD_USE_STREAM
  #define is_stream( x )  (unsigned char*)(x)->private_data
#else
  #define is_stream( x ) 0
#endif

#ifdef UFSD_NTFS
  static inline int is_dedup( IN const unode *u ) { return FlagOn( u->flags, UFSD_UNODE_FLAG_DEDUP ); }
#else
  #define is_dedup(u) 0
#endif


///////////////////////////////////////////////////////////
// set_valid_size
//
// Helper function to set valid size
///////////////////////////////////////////////////////////
static inline void
set_valid_size( IN unode *u, IN loff_t valid )
{
  unsigned long flags;
  write_lock_irqsave( &u->rwlock, flags );
  u->valid = valid;
  write_unlock_irqrestore( &u->rwlock, flags );
}


///////////////////////////////////////////////////////////
// get_valid_size
//
// Helper function to get useful info from inode
///////////////////////////////////////////////////////////
static inline loff_t
get_valid_size(
    IN  unode  *u,
    OUT loff_t *i_size,
    OUT loff_t *i_bytes
    )
{
  unsigned long flags;
  loff_t valid;
  read_lock_irqsave( &u->rwlock, flags );
  valid   = u->valid;
  if ( i_size )
    *i_size = i_size_read( &u->i );
  if ( i_bytes )
    *i_bytes = inode_get_bytes( &u->i );
  read_unlock_irqrestore( &u->rwlock, flags );
  return valid;
}


// How many seconds since 1970 till 1980
#define Seconds1970To1980     0x12CEA600

#ifdef UFSD_USE_POSIX_TIME
///////////////////////////////////////////////////////////
// posix2kernel
//
// Converts posix time into timestamp
///////////////////////////////////////////////////////////
static inline struct timespec64
posix2kernel(
    IN  UINT64  tm
    )
{
  struct timespec64 ts;
  union utimespec ut;
  ut.time64  = tm;
  ts.tv_sec  = ut.tv_sec;
  ts.tv_nsec = ut.tv_nsec;
  return ts;
}


///////////////////////////////////////////////////////////
// kernel2posix
//
// Converts timestamp to posix time
///////////////////////////////////////////////////////////
static inline UINT64
kernel2posix(
    IN const struct timespec64 *ts
    )
{
  union utimespec ut;
  ut.tv_sec  = ts->tv_sec;
  ut.tv_nsec = ts->tv_nsec;
  return ut.time64;
}


///////////////////////////////////////////////////////////
// current_time_posix
//
// This function returns the number of seconds since 1970
///////////////////////////////////////////////////////////
UINT64 UFSDAPI_CALL
current_time_posix( void )
{
  struct timespec64 ts;
  ktime_get_coarse_real_ts64( &ts );
  return kernel2posix( &ts );
}
#endif // #ifdef UFSD_USE_POSIX_TIME


#ifdef UFSD_USE_NT_TIME
#define _100ns2seconds        10000000UL
#define SecondsToStartOf1970  0x00000002B6109100ULL

///////////////////////////////////////////////////////////
// kernel2nt
//
// Converts timestamp into nt time
///////////////////////////////////////////////////////////
static inline UINT64
kernel2nt(
    IN const struct timespec64 *ts
    )
{
  // 10^7 units of 100 nanoseconds in one second
  return _100ns2seconds * ( ts->tv_sec + SecondsToStartOf1970 ) + ts->tv_nsec/100;
}


///////////////////////////////////////////////////////////
// nt2kernel
//
// Converts nt time into timestamp
///////////////////////////////////////////////////////////
static inline struct timespec64
nt2kernel(
    IN  const UINT64    tm
    )
{
  struct timespec64 ts;
  UINT64 t    = tm - _100ns2seconds*SecondsToStartOf1970;
  // WARNING: do_div changes its first argument(!)
  ts.tv_nsec = do_div( t, _100ns2seconds ) * 100;
  ts.tv_sec  = t;

  return ts;
}


///////////////////////////////////////////////////////////
// current_time_nt(GMT)
//
// This function returns the number of 100 nanoseconds since 1601
///////////////////////////////////////////////////////////
UINT64 UFSDAPI_CALL
current_time_nt( void )
{
  struct timespec64 ts;
  ktime_get_coarse_real_ts64( &ts );
  return kernel2nt( &ts );
}
#endif // #ifdef UFSD_USE_NT_TIME


///////////////////////////////////////////////////////////
// ufsd_inode_current_time
//
// Returns current time (to store in inode)
///////////////////////////////////////////////////////////
static inline struct timespec64
ufsd_inode_current_time(
    IN usuper *sbi
    )
{
  struct timespec64 ts;
  ktime_get_coarse_real_ts64( &ts );
  if ( is_hfs( sbi ) )
    ts.tv_nsec = 0;
  else if ( is_fat( sbi ) ) {
    // round up 2 seconds
    if ( ts.tv_nsec )
      ts.tv_sec += 1;
    if ( ts.tv_sec & 1 )
      ts.tv_sec += 1;
    ts.tv_nsec = 0;
  } else if ( is_exfat( sbi ) )
    ts.tv_nsec -= ts.tv_nsec % (NSEC_PER_SEC / 100);
  else
    ts.tv_nsec -= ts.tv_nsec % 100;

  return ts;
}


///////////////////////////////////////////////////////////
// ufsd_time_trunc
//
// Truncate time to a granularity
// Returns 1 if changed
///////////////////////////////////////////////////////////
static inline int
ufsd_time_trunc(
    IN usuper *sbi,
    IN const struct timespec64 *ts,
    IN OUT struct timespec64 *td
    )
{
  struct timespec64 t;

  t.tv_sec  = ts->tv_sec;

  if ( is_hfs( sbi ) )
    t.tv_nsec = 0;
  else if ( is_fat( sbi ) ) {
    // round up 2 seconds
    if ( ts->tv_nsec )
      t.tv_sec += 1;
    if ( t.tv_sec & 1 )
      t.tv_sec += 1;
    t.tv_nsec = 0;
  } else if ( is_exfat( sbi ) )
    t.tv_nsec = ts->tv_nsec - (ts->tv_nsec % (NSEC_PER_SEC / 100));
  else
    t.tv_nsec = ts->tv_nsec - (ts->tv_nsec % 100);

  if ( t.tv_sec == td->tv_sec && t.tv_nsec == td->tv_nsec )
    return 0;

  td->tv_sec  = t.tv_sec;
  td->tv_nsec = t.tv_nsec;
  return 1;
}


#if defined UFSD_EXFAT || defined UFSD_FAT
//
// This variable is used to get the bias
//
extern struct timezone sys_tz;

///////////////////////////////////////////////////////////
// ufsd_bias
//
// Returns minutes west of Greenwich
///////////////////////////////////////////////////////////
int UFSDAPI_CALL
ufsd_bias( void )
{
  return sys_tz.tz_minuteswest;
}
#endif


///////////////////////////////////////////////////////////
// ufsd_times_to_inode
//
// assume ufsd is locked  (fi is a pointer inside ufsd)
///////////////////////////////////////////////////////////
static inline void
ufsd_times_to_inode(
    IN const usuper   *sbi,
    IN const finfo    *fi,
    OUT struct inode  *i
    )
{
#ifdef UFSD_USE_POSIX_TIME
  if ( is_posixtime( sbi ) ) {
    UFSD_U( i )->i_crtime =  posix2kernel( fi->CrTime );
    inode_set_atime_to_ts(i, posix2kernel( fi->ReffTime ) );
    inode_set_ctime_to_ts(i, posix2kernel( fi->ChangeTime ) );
    inode_set_mtime_to_ts(i, posix2kernel( fi->ModiffTime ) );
  } else
#endif
  {
#ifdef UFSD_USE_NT_TIME
    UFSD_U( i )->i_crtime =  nt2kernel( fi->CrTime );
    inode_set_atime_to_ts(i, nt2kernel( fi->ReffTime ) );
    inode_set_ctime_to_ts(i, nt2kernel( fi->ChangeTime ) );
    inode_set_mtime_to_ts(i, nt2kernel( fi->ModiffTime ) );
#endif
  }
}


//
// Defines for "no access rules" mode
//
// 0777 mode
#define UFSD_NOACSR_MODE 0777
// group of permission attributes: ATTR_UID, ATTR_GID, ATTR_MODE
#define UFSD_NOACSR_ATTRS (ATTR_UID | ATTR_GID | ATTR_MODE)


///////////////////////////////////////////////////////////
// ufsd_to_linux
//
// Translates ufsd error codes into linux error codes
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_to_linux(
    IN int err // ufsd error
    )
{
  switch( err ) {
  case 0                  : return 0;
  case ERR_FSUNKNOWN      : return -EINVAL;       // -22
  case ERR_BADPARAMS      : return -EINVAL;       // -22
  case ERR_NOMEMORY       : return -ENOMEM;       // -12
  case ERR_NOFILEEXISTS   : return -ENOENT;       // -2
  case ERR_FILEEXISTS     : return -EEXIST;       // -17
  case 0xc000007f:
  case ERR_NOSPC          : return -ENOSPC;       // -28
  case ERR_WPROTECT       : return -EROFS;        // -30
  case ERR_BADNAME        : return -EINVAL;       // -22
  case ERR_BADNAME_LEN    : return -ENAMETOOLONG; // -36
  case ERR_NOTIMPLEMENTED : return -EOPNOTSUPP;   // -95, -ENOSYS??
  case ERR_DIRNOTEMPTY    : return -ENOTEMPTY;    // -39
  case ERR_MAXIMUM_LINK   : return -EMLINK;       // -31
  case ERR_INSUFFICIENT_BUFFER: return -ENODATA;  // -61
  case ERR_MORE_DATA      : return -ERANGE;       // -34, -EOVERFLOW for ioctl
  case ERR_FILE_TOO_BIG   : return -EFBIG;        // -27
  case ERR_FILE_STALE     : return -ESTALE;       //
  }

  // -EIO and others
  if ( (int)err >= -500 && err <= 4096 )
    return err;

  // error -> err0r to avoid error detection in tests
  DebugTrace( 0, 0, ("**** %s: unknown ufsd err0r %x", current->comm, err ) );
  return -EINVAL; // -22
}


typedef struct ufsd_mem_cache {
  struct kmem_cache *cache;
  char name[1];
} ufsd_mem_cache;


//
// Memory allocation routines.
// Debug version of memory allocation/deallocation routine performs
// detection of memory leak/overwrite
//
#ifdef UFSD_DEBUG_ALLOC

typedef struct memblock_head {
    struct list_head Link;
    unsigned int  asize;
    unsigned int  seq;
    unsigned int  size;
    unsigned char barrier[64 - 3*sizeof(int) - sizeof(struct list_head)];

  /*
     offset  0x40
     |---------------------|
     | Requested memory of |
     |   size 'DataSize'   |
     |---------------------|
  */
  //unsigned char barrier2[64 - 3*sizeof(int) - sizeof(struct list_head)];

} memblock_head;

static size_t TotalKmallocs;
static size_t TotalVmallocs;
static size_t UsedMemMax;
static size_t TotalAllocs;
static size_t TotalAllocBlocks;
static size_t TotalAllocSequence;
static size_t MemMaxRequest;
static size_t MemMinRequest = -1;
static LIST_HEAD(TotalAllocHead);
static DEFINE_SPINLOCK( debug_mem_lock );


///////////////////////////////////////////////////////////
// trace_mem_report
//
// Helper function to trace memory usage information
///////////////////////////////////////////////////////////
static void
trace_mem_report(
    IN int OnExit
    )
{
  if ( -1 != MemMinRequest ) {
    size_t Mb = UsedMemMax/(1024*1024);
    size_t Kb = (UsedMemMax%(1024*1024)) / 1024;
    size_t b  = UsedMemMax%1024;
    unsigned long level = OnExit? UFSD_LEVEL_ERROR : Dbg;

    if ( Mb ) {
      DebugTrace( 0, level, ("Memory report: Peak usage %zu.%03zu Mb (%zu bytes), kmalloc %zu, vmalloc %zu",
                    Mb, Kb, UsedMemMax, TotalKmallocs, TotalVmallocs ) );
    } else {
      DebugTrace( 0, level, ("Memory report: Peak usage %zu.%03zu Kb (%zu bytes),  kmalloc %zu, vmalloc %zu",
                    Kb, b, UsedMemMax, TotalKmallocs, TotalVmallocs ) );
    }
    DebugTrace( 0, level, ("%s:  %zu bytes in %zu blocks, Min/Max requests: %zu/%zu bytes",
                  OnExit? "Leak":"Total allocated", TotalAllocs, TotalAllocBlocks, MemMinRequest, MemMaxRequest ) );
  }
}


///////////////////////////////////////////////////////////
// ufsd_check_block_mem
//
// Helper function
///////////////////////////////////////////////////////////
static const char*
ufsd_check_block_mem(
    IN const memblock_head *block,
    OUT size_t *err_o
    )
{
  size_t o, tsize;
  const unsigned char *tst;

  // Verify head barrier
  for ( o = 0, tst = &block->barrier[0]; o < sizeof(block->barrier); o++ ) {
    if ( 0xde != tst[o] ) {
      *err_o = PtrOffset( block, tst ) + o;
      return "head";
    }
  }

  tsize = (block->asize & ~1) - block->size - sizeof(memblock_head);

  // Verify tail barrier
  for ( o = 0, tst = Add2Ptr( block + 1, block->size ); o < tsize; o++ ) {
    if ( 0xed != tst[o] ) {
      *err_o = PtrOffset( block, tst ) + o;
      return "tail";
    }
  }

  return NULL;
}
#else
#define trace_mem_report(OnExit)
#endif


///////////////////////////////////////////////////////////
// ufsd_heap_alloc
//
// memory allocation routine
///////////////////////////////////////////////////////////
void*
UFSDAPI_CALL
ufsd_heap_alloc(
    IN unsigned long size,
    IN int    zero
    )
{
  void *ptr;
#ifdef UFSD_DEBUG_ALLOC
  memblock_head *head;
  int use_kmalloc;
  // Overhead includes private information and two barriers to check overwriting
  size_t asize = size + sizeof(memblock_head) + sizeof(head->barrier);

  if ( asize <= 2*PAGE_SIZE ) {
    use_kmalloc = 1;
    // size_t align
    asize = (asize + sizeof(size_t)-1) & ~(sizeof(size_t)-1);
    head  = kmalloc( asize, GFP_NOFS );
  } else {
    use_kmalloc = 0;
    asize = PAGE_ALIGN( asize );
    head  = __vmalloc( asize, GFP_NOFS | __GFP_HIGHMEM );
    assert( (size_t)head >= VMALLOC_START && (size_t)head < VMALLOC_END );
#ifdef UFSD_DEBUG
    if ( (size_t)head < VMALLOC_START || (size_t)head >= VMALLOC_END )
      ufsd_trace( "vmalloc(%zx) returns %pK. Must be in range [%lx, %lx)", asize, head, (long)VMALLOC_START, (long)VMALLOC_END );
#endif
  }

  assert( head );
  if ( !head ) {
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("HeapAlloc(%lx) failed", size));
    return NULL;
  }
  assert( !(asize & 1U) );

  // Fill head private fields
  head->asize = use_kmalloc? asize : (asize | 1);
  head->size  = size;

  //  assert( size > 2 ); // Activate to find small allocations

  //
  // fills two barriers to check memory overwriting
  //
  memset( &head->barrier[0], 0xde, sizeof(head->barrier) );
  ptr = head + 1;
  memset( Add2Ptr( ptr, size), 0xed, asize - size - sizeof(memblock_head) );

  //
  // Insert allocated memory in global list and update statistics
  //
  spin_lock( &debug_mem_lock );
  list_add( &head->Link, &TotalAllocHead );
  if ( size > MemMaxRequest )
    MemMaxRequest = size;
  if ( size < MemMinRequest )
    MemMinRequest = size;
  head->seq   = ++TotalAllocSequence;
  use_kmalloc? ++TotalKmallocs : ++TotalVmallocs;
  TotalAllocs    += size;
  if( TotalAllocs > UsedMemMax )
    UsedMemMax = TotalAllocs;
  TotalAllocBlocks += 1;
  spin_unlock( &debug_mem_lock );

  DebugTrace( 0, UFSD_LEVEL_MEMMNGR, ("alloc(%lx) -> %pK%s, seq=%x", size, ptr, use_kmalloc? "" : "(v)", head->seq));
#else
  if ( size <= 2*PAGE_SIZE ) {
    ptr = kmalloc( size, GFP_NOFS );
  } else {
    ptr = __vmalloc( size, GFP_NOFS | __GFP_HIGHMEM );
    assert( (size_t)ptr >= VMALLOC_START && (size_t)ptr < VMALLOC_END );
  }
  if ( !ptr ) {
    assert( !"no memory" );
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("alloc(%lx) failed", size));
    return NULL;
  }

  DebugTrace( 0, UFSD_LEVEL_MEMMNGR, ("alloc(%lx) -> %pK%s", size, ptr, size <= PAGE_SIZE?"" : "(v)" ));
#endif

  if ( zero )
    memset( ptr, 0, size );
  return ptr;
}


///////////////////////////////////////////////////////////
// ufsd_heap_free
//
// memory deallocation routine
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_heap_free(
    IN void *p
    )
{
#ifdef UFSD_DEBUG_ALLOC
  memblock_head *block;
  size_t o;
  const char *hint;

  if ( !p )
    return;

#if 1
  // Fast but unsafe find
  block = (memblock_head*)p - 1;
#else
  // Safe but very slow. Use only if big trouble
  spin_lock( &debug_mem_lock );
  {
    struct list_head  *pos;
    block = NULL; // assume not found
    list_for_each( pos, &TotalAllocHead ){
      memblock_head *fnd = list_entry( pos, memblock_head, Link );
      if ( p == (void*)(fnd + 1) ) {
        block = fnd;
        break;
      }
    }
  }
  spin_unlock( &debug_mem_lock );

  if ( !block ) {
    assert( !"failed to find block" );
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("HeapFree(%pK) failed to find block", p ));
    dump_stack();
//    BUG_ON(1);
    return;
  }
#endif

  hint = ufsd_check_block_mem( block, &o );
  if ( hint ) {
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("**** seq=%x: size 0x%x  asize 0x%x", block->seq, block->size, block->asize ));
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("**** HeapFree(%pK) %s barrier failed at 0x%zx", p, hint, o ));
    ufsd_turn_on_trace_level();
    ufsdapi_dump_memory( block, 512 );
    ufsd_revert_trace_level();
    BUG_ON(1);
  }

  //
  // Remove allocated memory from global list and update statistics
  //
  spin_lock( &debug_mem_lock );
  list_del( &block->Link );
  TotalAllocs -= block->size;
  TotalAllocBlocks -= 1;
  spin_unlock( &debug_mem_lock );

  DebugTrace( 0, UFSD_LEVEL_MEMMNGR, ("free(%pK, %x) seq=%x", block + 1, block->size, block->seq));

  memset( block + 1, 0xcc, block->size );

  // declaration of vfree and kfree differs!
  if ( block->asize & 1U )
    vfree( block );
  else
    kfree( block );
#else

  if ( p ) {
    DebugTrace( 0, UFSD_LEVEL_MEMMNGR, ("HeapFree(%pK)", p));
    if ( (size_t)p >= VMALLOC_START && (size_t)p < VMALLOC_END ) {
      // This memory was allocated via vmalloc
      vfree( p );
    } else {
      // This memory was allocated via kmalloc
      kfree( p );
    }
  }
#endif
}


///////////////////////////////////////////////////////////
// ufsd_cache_create
//
// Creates cache to allocate objects of the same size
///////////////////////////////////////////////////////////
void*
UFSDAPI_CALL
ufsd_cache_create(
    IN const char *Name,
    IN unsigned   size,
    IN unsigned   align
    )
{
  size_t name_size    = strlen(Name) + 1 + sizeof(QUOTED_UFSD_DEVICE);
  ufsd_mem_cache *umc = kmalloc( offsetof( ufsd_mem_cache, name ) + name_size, GFP_NOFS );

  if ( umc ) {
    snprintf( umc->name, name_size, QUOTED_UFSD_DEVICE "_%s", Name );
    umc->cache = kmem_cache_create( umc->name, size, align, SLAB_RECLAIM_ACCOUNT, NULL );

    DebugTrace( 0, Dbg, ("cache_create(\"%s\", %x) -> %s", umc->name, size, umc->cache? "ok" : "failed" ) );
    if ( !umc->cache ) {
      kfree( umc );
      umc = NULL;
    }
  }

  return umc;
}


///////////////////////////////////////////////////////////
// ufsd_cache_destroy
//
// Destroys cache
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_cache_destroy(
    IN void *Cache
    )
{
  ufsd_mem_cache *umc = Cache;
  DebugTrace( 0, Dbg, ("cache_destroy(\"%s\")", umc->name ) );
  kmem_cache_destroy( umc->cache );
  kfree( umc );
}


///////////////////////////////////////////////////////////
// ufsd_cache_alloc
//
// Allocates memory from cache
///////////////////////////////////////////////////////////
void*
UFSDAPI_CALL
ufsd_cache_alloc(
    IN void *Cache,
    IN int  bZero
    )
{
  ufsd_mem_cache *umc = Cache;
  void  *p = kmem_cache_alloc( umc->cache, bZero? (__GFP_ZERO | GFP_NOFS ) : GFP_NOFS );
  DebugTrace( 0, UFSD_LEVEL_MEMMNGR, ("cache(\"%s\") -> %pK", umc->name, p ) );
  return p;
}


///////////////////////////////////////////////////////////
// ufsd_cache_free
//
// Returns memory to cache
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_cache_free(
    IN void *Cache,
    IN void *p
    )
{
  ufsd_mem_cache *umc = Cache;
  DebugTrace( 0, UFSD_LEVEL_MEMMNGR, ("cache(\"%s\") <- %pK", umc->name, p ) );
  kmem_cache_free( umc->cache, p );
}


#ifdef UFSD_USE_SHARED_FUNCS
//
// Shared memory struct.
// Used to share memory between volumes
//
static DEFINE_SPINLOCK( s_shared_lock );

static struct {
  void      *ptr;
  unsigned  len;
  int       cnt;
} s_shared[8];


///////////////////////////////////////////////////////////
// ufsd_set_shared
//
// Returns 'ptr' if pointer was saved in shared memory
// Returns not NULL if pointer was shared
///////////////////////////////////////////////////////////
void*
UFSDAPI_CALL
ufsd_set_shared(
    IN void     *ptr,
    IN unsigned bytes
    )
{
  void  *ret = NULL;
  int i, j = -1;

  spin_lock( &s_shared_lock );
  for ( i = 0; i < ARRAY_SIZE(s_shared); i++ ) {
    if ( !s_shared[i].cnt )
      j = i;
    else if ( bytes == s_shared[i].len && !memcmp ( s_shared[i].ptr, ptr, bytes ) ) {
      s_shared[i].cnt += 1;
      ret = s_shared[i].ptr;
      break;
    }
  }

  if ( !ret && -1 != j ) {
    s_shared[j].ptr = ptr;
    s_shared[j].len = bytes;
    s_shared[j].cnt = 1;
    ret = ptr;
  }
  spin_unlock( &s_shared_lock );

  DebugTrace( 0, Dbg, ("set_shared(%pK,%x) -> %pK",  ptr, bytes, ret ));
  return ret;
}


///////////////////////////////////////////////////////////
// ufsd_put_shared
//
// Returns 'ptr' if pointer is not shared anymore
// Returns NULL if pointer is still shared
///////////////////////////////////////////////////////////
void*
UFSDAPI_CALL
ufsd_put_shared(
    IN void *ptr
    )
{
  void  *ret = ptr;
  int i;

  spin_lock( &s_shared_lock );
  for ( i = 0; i < ARRAY_SIZE(s_shared); i++ ) {
    if ( s_shared[i].cnt && s_shared[i].ptr == ptr ) {
      if ( --s_shared[i].cnt )
        ret = NULL;
      break;
    }
  }
  spin_unlock( &s_shared_lock );

  DebugTrace( 0, Dbg, ("put_shared (%pK) -> %pK",  ptr, ret ));
  return ret;
}
#endif // #ifdef UFSD_USE_SHARED_FUNCS


//
// NLS support routines requiring
// access to kernel-dependent nls_table structure.
//

///////////////////////////////////////////////////////////
// ufsd_char2uni
//
// Converts multibyte string to UNICODE string
// Returns the length of destination string in wide symbols
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_char2uni(
    OUT unsigned short      *ws,        // Destination UNICODE string
    IN  int                 max_out,    // Maximum UNICODE characters in ws
    IN  const unsigned char *s,         // Source BCS string
    IN  int                 len,        // The length of BCS strings in bytes
    IN  struct nls_table    *nls        // Code pages
    )
{
#ifdef UFSD_USE_NLS
  int ret   = 0;
  int len0  = len;

  for ( ;; ) {

    int charlen;
    wchar_t wc;

    if ( len <= 0 || !*s )
      return ret; // The only correct way to exit

    if ( max_out <= 0 ) {
TooLittle:
      DebugTrace( 0, UFSD_LEVEL_ERROR, ("A2U: too little output buffer" ) );
      return ret;
    }

    wc      = *ws;
    charlen = nls->char2uni( s, len, &wc );

    if ( charlen <= 0 ) {
      ufsd_printk( NULL, "%s -> unicode failed: '%.*s', pos %d, chars %x %x %x",
                   nls->charset, len0, s - (len0-len), len0-len, (int)s[0], len > 1? (int)s[1] : 0, len > 2? (int)s[2] : 0 );
      //
      // Code one symbol
      //
      if ( max_out < 3 )
        goto TooLittle;

      *ws++ = '%';
      *ws++ = get_digit( *s >> 4 );
      *ws++ = get_digit( *s >> 0 );

      ret     += 3;
      max_out -= 3;
      len     -= 1;
      s       += 1;

    } else {
      assert( (unsigned short)wc == wc );

      *ws++    = (unsigned short)wc;
      ret     += 1;
      max_out -= 1;
      len     -= charlen;
      s       += charlen;
    }
  }

#else

  *ws = 0;
  return 0;

#endif
}


///////////////////////////////////////////////////////////
// ufsd_uni2char
//
// Converts UNICODE string to multibyte
// Returns the length of destination string in chars
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_uni2char(
    OUT unsigned char         *s,         // Destination BCS string
    IN  int                   max_out,    // Maximum bytes in BCS string
    IN  const unsigned short  *ws,        // Source UNICODE string
    IN  int                   len,        // The length of UNICODE string
    IN  struct nls_table      *nls        // Code pages
   )
{
#ifdef UFSD_USE_NLS
  unsigned char *s0 = s;

  for ( ;; ) {

    int charlen;

    if ( len <= 0 || !*ws )
      return (int)(s - s0); // The only correct way to exit

    if ( max_out <= 0 ) {
      DebugTrace( 0, UFSD_LEVEL_ERROR, ("U2A: too little output buffer" ) );
      return (int)(s - s0);
    }

    charlen = nls->uni2char( *ws, s, max_out );
    if ( charlen <= 0 ) {
      assert( !"U2A: failed to convert" );
      ufsd_printk( NULL, "unicode -> %s failed: pos %d, chars %x %x %x",
                   nls->charset, (int)(s-s0), (unsigned)ws[0], len > 1? (unsigned)ws[1] : 0, len > 2? (unsigned)ws[2] : 0 );
      return 0;
    }

    ws      += 1;
    len     -= 1;
    max_out -= charlen;
    s       += charlen;
  }

#else

  *s = 0;
  return 0;

#endif
}


#ifdef UFSD_FAT
///////////////////////////////////////////////////////////
// ufsd_toupper
//
// Converts UTF8 oe OEM string to upcase
// Returns 0 if ok
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_toupper(
    IN  struct nls_table      *nls,       // Code pages
    IN OUT unsigned char      *s,         // Source and Destination string
    IN  int                   len         // The length of ASCII or OEM string
    )
{
  int i;
  for ( i = 0; i < len; i++ )
    s[i] = nls_toupper( nls, s[i] );
}
#endif


#ifdef UFSD_USE_NLS
///////////////////////////////////////////////////////////
// ufsd_uload_nls
//
//
///////////////////////////////////////////////////////////
static inline void
ufsd_uload_nls(
    IN OUT mount_options  *opts
    )
{
  unload_nls( opts->nls );
  opts->nls = NULL;

#ifdef UFSD_FAT
  unload_nls( opts->nls_oem );
  opts->nls_oem = NULL;
#endif
}
#else
  #define ufsd_uload_nls( o )
#endif // #ifdef UFSD_USE_NLS


//
// Device IO functions.
//
#if defined UFSD_HFS || defined UFSD_REFS34 || defined UFSD_REFS3
///////////////////////////////////////////////////////////
// bh_tail
//
// Get buffer_head for tail
///////////////////////////////////////////////////////////
static struct buffer_head*
bh_tail(
    IN struct super_block *sb,
    IN size_t              bytes2skip
    )
{
  struct buffer_head *bh;
  usuper *sbi = UFSD_SB( sb );
  sector_t TailBlock = ((sbi->max_block << sb->s_blocksize_bits) + bytes2skip) >> 9;
  struct page *page = alloc_page( GFP_KERNEL );
  if ( !page )
    return NULL;
  bh = alloc_buffer_head( GFP_NOFS );
  if ( !bh ) {
out:
    __free_page( page );
    return NULL;
  }

  bh->b_state = 0;
  bh->b_end_io = end_buffer_read_sync;
  bh->b_private = NULL;
  atomic_set( &bh->b_count, 2 );
  folio_set_bh( bh, page_folio(page), bytes2skip );
  bh->b_size    = 512;
  bh->b_bdev    = sb->s_bdev;
  bh->b_blocknr = TailBlock;
  set_buffer_mapped( bh );
  lock_buffer( bh );
  submit_bh( READ, bh );
  wait_on_buffer( bh );
  if ( !buffer_uptodate( bh ) ) {
    brelse( bh );
    goto out;
  }

  assert( 1 == atomic_read( &bh->b_count ) );
//    DebugTrace( 0, 0, ("bh_tail"));
  get_bh( bh );
  return bh;
}
#define bh_tail bh_tail
#endif


#if defined UFSD_TURN_OFF_READAHEAD || LINUX_VERSION_CODE >= KERNEL_VERSION(6,12,0)
unsigned long
UFSDAPI_CALL
ufsd_bd_read_ahead(
    IN struct super_block *sb,
    IN unsigned long long offset,
    IN unsigned long      bytes
    )
{
  return 0;
}
#else

///////////////////////////////////////////////////////////
// ufsd_blkdev_get_block
//
// Default get_block for device
///////////////////////////////////////////////////////////
static int
ufsd_blkdev_get_block(
    IN struct inode *inode,
    IN sector_t iblock,
    IN OUT struct buffer_head *bh,
    IN int create
    )
{
  bh->b_bdev    = I_BDEV(inode);
  bh->b_blocknr = iblock;
  set_buffer_mapped( bh );
  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_bd_read_ahead
//
// Idea from mm/readahead.c
///////////////////////////////////////////////////////////
unsigned long
UFSDAPI_CALL
ufsd_bd_read_ahead(
    IN struct super_block *sb,
    IN unsigned long long offset,
    IN unsigned long      bytes
    )
{
  struct list_head page_pool;
  unsigned long nr_pages, page_idx;
  struct blk_plug plug;
  struct page *page;
  struct address_space *mapping = sb->s_bdev->bd_mapping;
  usuper    *sbi  = UFSD_SB( sb );
  pgoff_t start   = offset >> PAGE_SHIFT;
  pgoff_t end     = (offset + bytes) >> PAGE_SHIFT;
  pgoff_t end_dev = sbi->dev_size >> PAGE_SHIFT;
  gfp_t gfp_mask = mapping_gfp_mask(mapping) | __GFP_NORETRY | __GFP_NOWARN;
  unsigned long max_ra  = global_zone_page_state( NR_FREE_PAGES ) >> 1;

  if ( sbi->options.raKb ) {
    unsigned long ra = sbi->options.raKb >> ( PAGE_SHIFT-10 );
    if ( max_ra > ra )
      max_ra = ra;
  }

  DebugTrace( 0, UFSD_LEVEL_IO, ("bd_read_ahead: \"%s\", [%llx, + %llx), max_ra=%lx, nr_pages=%lx",
              sb->s_id, (UINT64)start, (UINT64)(end - start), max_ra, mapping->nrpages ));

  if ( !max_ra || start >= end_dev )
    return 0;

  // Check range
  if ( end > end_dev )
    end = end_dev;

  if ( end > start + max_ra )
    end = start + max_ra;

  //
  // Preallocate as many pages as we will need.
  //
  INIT_LIST_HEAD( &page_pool );
  for ( nr_pages = 0; start < end; start++ ) {
    xa_lock_irq( &mapping->i_pages );
    page = radix_tree_lookup( &mapping->i_pages, start );
    xa_unlock_irq( &mapping->i_pages );

    if ( page )
      continue;

    page = __page_cache_alloc(gfp_mask);
    if ( !page ){
      ufsd_printk( sb, "bd_read_ahead, oom at %lx pages\n", nr_pages );
      if ( !sbi->options.raKb )
        ufsd_printk( sb, "We're using some unconditional optimizations to speed up the mount process "
        "(trade off is memory usage). In the corner case where the volume is large and the amount of RAM is limited,"
        "these unconditional optimizations may lead to low performance on mounting large volumes. To overcome this, "
        "the explicit readahead mount option is recommended to use (ra=1M).\n" );
      // Do not start IO if we out of memory
      put_pages_list( &page_pool );
      return 0;
    }

    page->index = start;
    list_add( &page->lru, &page_pool );
    if ( !nr_pages )
      folio_set_readahead(page_folio(page));
    nr_pages += 1;
  }

  if ( !nr_pages )
    return 0;

  //
  // Now start the IO.  We ignore I/O errors - if the page is not
  // uptodate then the caller will launch readpage again, and
  // will then handle the error.
  //
  blk_start_plug( &plug );

  for (page_idx = 0; page_idx < nr_pages; page_idx++) {
    page = list_entry(page_pool.prev, struct page, lru);

    prefetchw(&page->flags);
    list_del(&page->lru);
    if (!add_to_page_cache_lru(page, mapping, page->index, gfp_mask )) {
      mpage_read_folio( page_folio(page), ufsd_blkdev_get_block );
    }
    put_page(page);
  }

  put_pages_list( &page_pool );  // Clean up the remaining pages

  blk_finish_plug( &plug );

  DebugTrace( 0, UFSD_LEVEL_IO, ("bd_read_ahead -> %lx", nr_pages ));
  return nr_pages << PAGE_SHIFT;
}
#endif // #if defined UFSD_TURN_OFF_READAHEAD || LINUX_VERSION_CODE > KERNEL_VERSION(6,12,0)


///////////////////////////////////////////////////////////
// ufsd_bd_unmap_meta
//
// We call this in LookForFreeSpace functions because we can't
// know for sure whether block was used previously or not -
// so we wait for I/O on this block
// @offset: offset in bytes from the beginning of block device
// @bytes: length in bytes
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_bd_unmap_meta(
    IN struct super_block *sb,
    IN unsigned long long offset,
    IN unsigned long long bytes
    )
{
  DEBUG_ONLY( usuper *sbi = UFSD_SB( sb ); )
  struct block_device *bdev = sb->s_bdev;
  sector_t  devblock        = offset >> sb->s_blocksize_bits;
  unsigned long nBlocks     = bytes >> sb->s_blocksize_bits;
  unsigned long cnt         = 0;
  unsigned long limit       = global_zone_page_state( NR_FREE_PAGES ) << (PAGE_SHIFT - sb->s_blocksize_bits);

  if ( limit >= 0x2000 )
    limit -= 0x1000;
  else if ( limit < 32 )
    limit = 32;
  else
    limit >>= 1;

  DebugTrace( 0, UFSD_LEVEL_IO, ("unmap_meta: \"%s\", [%" PSCT "x + %lx)", sb->s_id, devblock, nBlocks ));

  while( nBlocks-- ) {
    clean_bdev_aliases( bdev, devblock++, 1 );

    if ( cnt++ >= limit ) {
      DEBUG_ONLY( sbi->bdunmap_meta_sync += 1; )
      sync_blockdev( bdev );
      cnt = 0;
    }
  }
}


///////////////////////////////////////////////////////////
// ufsd_bd_read
//
// Read data from block device
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_read(
    IN  struct super_block *sb,
    IN  UINT64  offset,
    IN  size_t  bytes,
    OUT void    *buffer
    )
{
  usuper    *sbi        = UFSD_SB( sb );
  sector_t  devblock    = offset >> sb->s_blocksize_bits;
  unsigned  blocksize   = sb->s_blocksize;
  size_t    bytes2skip  = ((size_t)offset) & (blocksize - 1); // offset % sb->s_blocksize
  int err               = 0;

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

#ifdef UFSD_DEBUG
  if ( unlikely( sbi->eject ) ) {
    ufsd_printk( sb, "bd_read ejected block 0x%" PSCT "x", devblock );
    return -EIO;
  }
#endif

  DebugTrace( +1, UFSD_LEVEL_IO, ("bdread: \"%s\", %" PSCT "x, %zx", sb->s_id, devblock, bytes));

  while ( bytes ) {
    size_t ToRead;
    struct buffer_head *bh;

#ifdef bh_tail
    if ( devblock == sbi->max_block ) {
      assert( 512 == bytes );
      bh = bh_tail( sb, bytes2skip );
      bytes2skip = 0;
    } else
#endif
    {
      DEBUG_ONLY( if ( bytes2skip || bytes < blocksize ) sbi->nReadBlocksNa += 1; )

      bh = sb_getblk_gfp( sb, devblock, __GFP_MOVABLE | GFP_NOFS );

      if ( bh ) {
        if ( buffer_uptodate( bh ) ) {
          DEBUG_ONLY( sbi->nBufHit += 1; )
        } else {
          lock_buffer( bh );
          bh->b_end_io = end_buffer_read_sync;
          get_bh( bh );
          submit_bh( READ, bh );
          wait_on_buffer( bh );
          if ( !buffer_uptodate( bh ) ) {
            put_bh( bh );
            bh = NULL;
          }
        }
      }
    }

    if ( !bh ) {
      ufsd_printk( sb, "failed to read block 0x%" PSCT "x", devblock );
      err = -EIO;
      goto out;
    }

    DEBUG_ONLY( sbi->nReadBlocks += 1; )

    ToRead = blocksize - bytes2skip;
    if ( ToRead > bytes )
      ToRead = bytes;

    memcpy( buffer, bh->b_data + bytes2skip, ToRead );

    put_bh( bh );

    buffer      = Add2Ptr( buffer, ToRead );
    devblock   += 1;
    bytes      -= ToRead;
    bytes2skip  = 0;
  }

out:
#ifdef UFSD_DEBUG
  if ( ufsd_trace_level & UFSD_LEVEL_IO )
    ufsd_trace_inc( -1 );
#endif
//  DebugTrace( -1, UFSD_LEVEL_IO, ("bdread -> ok"));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_bd_write
//
// Write data to block device
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_write(
    IN struct super_block *sb,
    IN UINT64       offset,
    IN size_t       bytes,
    IN const void   *buffer,
    IN size_t       wait
    )
{
  usuper    *sbi        = UFSD_SB( sb );
  sector_t  devblock    = offset >> sb->s_blocksize_bits;
  unsigned  blocksize   = sb->s_blocksize;
  size_t    bytes2skip  = ((size_t)offset) & (blocksize - 1); // offset % sb->s_blocksize
  int  err              = 0;

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  if ( !wait && FlagOn( sb->s_flags, SB_SYNCHRONOUS ) )
    wait = UFSD_RW_WAIT_SYNC;

#ifdef UFSD_DEBUG
#ifdef ufsd_buf_get
  if ( is_refs34( sbi ) || is_refs3( sbi ) || is_refs( sbi ) )
  {
    assert( 0 );
    DebugTrace( 0, 0, ("bdwrite: \"%s\", off=%llx, bytes=%zx%s", sb->s_id, offset, bytes, wait?", wait":""));
    dump_stack();
  }
#endif

  if ( unlikely( sbi->eject ) ) {
    ufsd_printk( sb, "bd_write ejected block 0x%" PSCT "x", devblock );
    return -EIO;
  }
#endif

  DebugTrace( +1, UFSD_LEVEL_IO, ("bdwrite: \"%s\", %" PSCT "x, %zx%s", sb->s_id, devblock, bytes, wait?", wait":""));

  while ( bytes ) {
    size_t towrite;
    struct buffer_head *bh;

#ifdef bh_tail
    if ( devblock == sbi->max_block ) {
      assert( bytes == 512 );
      bh = bh_tail( sb, bytes2skip );
      bytes2skip = 0;
    } else
#endif
    {
      if ( bytes2skip || bytes < blocksize ){
        DEBUG_ONLY( sbi->nWrittenBlocksNa += 1; )
        bh = sb_bread( sb, devblock );
      } else {
        bh = sb_getblk( sb, devblock );
      }
    }

    if ( !bh ) {
      err = -EIO;
      goto out;
    }

    if ( buffer_locked( bh ) )
      __wait_on_buffer( bh );

    towrite = blocksize - bytes2skip;
    if ( towrite > bytes )
      towrite = bytes;

    //
    // Update buffer with user data
    //
    lock_buffer( bh );
    if ( buffer ) {
      memcpy( bh->b_data + bytes2skip, buffer, towrite );
      buffer  = Add2Ptr( buffer, towrite );
    } else {
      memset( bh->b_data + bytes2skip, 0, towrite );
    }

    set_buffer_uptodate( bh );
    mark_buffer_dirty( bh );
    unlock_buffer( bh );

    DEBUG_ONLY( sbi->nWrittenBlocks += 1; )

    if ( wait ) {
#ifdef UFSD_DEBUG
      if ( !(ufsd_trace_level & UFSD_LEVEL_IO) )
        DebugTrace( 0, UFSD_LEVEL_VFS, ("bdwrite(wait), bh=%" PSCT "x", devblock));
#endif

      err = sync_dirty_buffer( bh );

      if ( err ) {
        ufsd_printk( sb, "failed to sync buffer at block %" PSCT "x, error %d", bh->b_blocknr, err );
        put_bh( bh );
        goto out;
      }
    }

    put_bh( bh );

    devblock    += 1;
    bytes       -= towrite;
    bytes2skip   = 0;
  }

out:
#ifdef UFSD_DEBUG
  if ( ufsd_trace_level & UFSD_LEVEL_IO )
    ufsd_trace_inc( -1 );
#endif
//  DebugTrace( -1, UFSD_LEVEL_IO, ("bd_write -> ok"));
  return err;
}


#ifdef UFSD_USE_BD_MAP
///////////////////////////////////////////////////////////
// ufsd_bd_map
//
//
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_map(
    IN  struct super_block *sb,
    IN  UINT64  offset,
    IN  size_t  bytes,
    IN  size_t  flags,
    OUT struct buffer_head **bcb,
    OUT void    **mem
    )
{
  struct buffer_head *bh;
  usuper *sbi = UFSD_SB( sb );
  unsigned blocksize  = sb->s_blocksize;
  sector_t  devblock  = (sector_t)(offset >> sb->s_blocksize_bits);
  size_t bytes2skip   = (size_t)(offset & (blocksize - 1)); // offset % sb->s_blocksize
  DEBUG_ONLY( const char *hint; )
  DEBUG_ONLY( const char *hint2 = ""; )

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  if ( bytes2skip + bytes > blocksize ) {
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("bdmap: [%llx %zx] overlaps block boundary %x", offset, bytes, blocksize));
    return -EINVAL;
  }

#ifdef UFSD_DEBUG
  if ( unlikely( sbi->eject ) ) {
    ufsd_printk( sb, "bd_map ejected block 0x%" PSCT "x", devblock );
    return -EIO;
  }
#endif

#ifdef bh_tail
  if ( devblock == sbi->max_block ) {
    assert( bytes == 512 );
    bh = bh_tail( sb, bytes2skip );
    bytes2skip = 0;
    DEBUG_ONLY( hint = "tail "; )
  } else
#endif
  {
    bh = sb_getblk_gfp( sb, devblock, __GFP_MOVABLE | GFP_NOFS );
    if ( !bh ) {
      DEBUG_ONLY( hint = ""; ) // to suppress some compiler warnings
    } else if ( !bytes2skip && bytes == blocksize && FlagOn( flags, UFSD_RW_MAP_NO_READ ) ) {
      DEBUG_ONLY( hint = "n "; )
      set_buffer_uptodate( bh );
    } else if ( buffer_uptodate( bh ) ) {
      DEBUG_ONLY( hint = "c "; )
    } else {
      DEBUG_ONLY( hint = "r "; )
      lock_buffer( bh );
      bh->b_end_io = end_buffer_read_sync;
      get_bh( bh );
      submit_bh( READ, bh );
      wait_on_buffer( bh );
      if ( !buffer_uptodate( bh ) ) {
        put_bh( bh );
        bh = NULL;
      }
    }
  }

  if ( !bh )
    return -EIO;

  if ( buffer_locked( bh ) ) {
    DEBUG_ONLY( hint2 = " w"; )
    __wait_on_buffer( bh );
  }

  DebugTrace( 0, UFSD_LEVEL_IO, ("bdmap: \"%s\", %" PSCT "x, %zx, %s%s%s -> %pK (%d)", sb->s_id, devblock, bytes,
              hint, buffer_dirty( bh )?"d":"c", hint2, bh, atomic_read( &bh->b_count ) ));

  //
  // Return pointer into page
  //
  *mem = Add2Ptr( bh->b_data, bytes2skip );
  *bcb = bh;

#ifdef UFSD_DEBUG
  sbi->nMappedBh += 1;
  assert( sbi->nMappedBh >= sbi->nUnMappedBh );
  {
    size_t buffers = sbi->nMappedBh - sbi->nUnMappedBh;
    if ( buffers > sbi->nPeakMappedBh )
      sbi->nPeakMappedBh = buffers;
  }
#endif

  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_bd_unmap
//
//
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_bd_unmap(
#ifdef UFSD_DEBUG
    IN struct super_block *sb,
#endif
    IN struct buffer_head *bh,
    IN int Forget
    )
{
  DebugTrace( 0, UFSD_LEVEL_IO, ("bdunmap: \"%s\", %" PSCT "x,%s %d", sb->s_id, bh->b_blocknr, buffer_dirty( bh )?"d":"c", atomic_read( &bh->b_count ) - 1 ));
  (Forget?__bforget : put_bh)( bh );

  DEBUG_ONLY( UFSD_SB( sb )->nUnMappedBh += 1; )
}


///////////////////////////////////////////////////////////
// ufsd_bd_set_dirty
//
// Mark buffer as dirty and sync it if necessary
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_set_dirty(
    IN struct super_block *sb,
    IN struct buffer_head *bh,
    IN size_t   wait
    )
{
  int err = 0;

  if ( !wait && FlagOn( sb->s_flags, SB_SYNCHRONOUS ) )
    wait = UFSD_RW_WAIT_SYNC;

  DebugTrace( 0, UFSD_LEVEL_IO, ("bddirty: \"%s\", %" PSCT "x,%s %d", sb->s_id, bh->b_blocknr, buffer_dirty( bh )?"d":"c", atomic_read( &bh->b_count ) ));
  set_buffer_uptodate( bh );
  mark_buffer_dirty( bh );

  if ( wait ) {
    err = sync_dirty_buffer( bh );
    if ( err )
      ufsd_printk( sb, "failed to sync buffer at block %" PSCT "x, error %d", bh->b_blocknr, err );
  }
#ifdef bh_tail
  else if ( bh->b_blocknr >= UFSD_SB(sb)->max_block ) {
    DebugTrace( 0, UFSD_LEVEL_IO, ("write tail: %" PSCT "x", bh->b_blocknr ));
    lock_buffer( bh );
    submit_bh( WRITE, bh ); // == REQ_OP_WRITE
  }
#endif

  return err;
}
#endif

#if (defined UFSD_REFS1 || defined UFSD_REFS34 || defined UFSD_REFS3) && defined ufsd_buf_get

#define UFSD_BUF_FLAG_READ    (1 << 0)
#define UFSD_BUF_FLAG_WRITE   (1 << 1)
#define UFSD_BUF_FLAG_PAGES   (1 << 20) // alloc_page
#define UFSD_BUF_FLAG_KMEM    (1 << 21) // kmalloc


typedef struct ufsd_buf {

  unsigned long long  lbo;          // Lbo of buffer
  unsigned int        bytes;        // size of buffer
  atomic_t            count;        // reference count
  void                *addr;        // virtual address of buffer
  unsigned long       flags;        // UFSD_BUF_FLAG_XXX

  spinlock_t          lock;         // internal state lock
  int                 error;        //
  wait_queue_head_t   waiters;      // unpin waiters

  struct completion   iowait;       // queue for I/O waiters
  struct page         **pages;      // array of page pointers
  struct page         *page_array[4];  // inline pages
  atomic_t            io_remaining; //  outstanding I/O requests
  unsigned int        page_count;   //  size of page array
  unsigned int        offset;       //  page offset in first page

} ufsd_buf;

// Return true if the buffer is vmapped
#define ufsd_buf_is_vmapped( ub )   (ub)->page_count > 1
// Return the length of mapped area
#define ufsd_buf_vmap_len( ub ) ((ub)->bytes) - (ub)->offset


///////////////////////////////////////////////////////////
// ufsd_buf_alloc
//
//
///////////////////////////////////////////////////////////
static ufsd_buf*
ufsd_buf_alloc(
    IN unsigned long long lbo,
    IN unsigned int       bytes
    )
{
  unsigned long i, page_count;
  ufsd_buf  *ub = kmalloc( sizeof(ufsd_buf), __GFP_ZERO|GFP_NOFS );
  if ( unlikely( !ub ) )
    return NULL;

  ub->lbo   = lbo;
  ub->bytes = bytes;
  atomic_set( &ub->count, 1 );
  spin_lock_init( &ub->lock );
  init_waitqueue_head( &ub->waiters );
  init_completion( &ub->iowait );

  if ( bytes < PAGE_SIZE ) {
    size_t addr = (size_t)kmalloc( bytes, __GFP_ZERO|GFP_NOFS );
    if ( likely( addr ) ) {
      if ( ((addr + bytes - 1) & PAGE_MASK) == (addr & PAGE_MASK) ) {
        ub->addr        = (void*)addr;
        ub->offset      = offset_in_page( ub->addr );
        ub->pages       = ub->page_array;
        ub->pages[0]    = virt_to_page( ub->addr );
        ub->page_count  = 1;
        SetFlag( ub->flags, UFSD_BUF_FLAG_KMEM );
        goto out;
      }

      // addr spans two pages
      kfree( (void*)addr );
    }
  }

  page_count = ((lbo + bytes + PAGE_SIZE - 1) >> PAGE_SHIFT) - (lbo >> PAGE_SHIFT);
  if ( page_count <= ARRSIZE(ub->page_array) ) {
    ub->pages = ub->page_array;
  } else {
    ub->pages = kmalloc( sizeof(struct page*) * page_count, __GFP_ZERO|GFP_NOFS );
    if ( unlikely( !ub->pages ) ) {
      kfree( ub );
      return NULL;
    }
  }

  ub->page_count = page_count;
  SetFlag( ub->flags, UFSD_BUF_FLAG_PAGES );

  for ( i = 0; i < page_count; i++ ) {
    unsigned retries;

    for ( retries = 0; ; retries++ ) {
      struct page *page = alloc_page( GFP_KERNEL );
      if ( likely( page ) ) {
        ub->pages[i] = page;
        break;
      }

      if ( !(retries % 100) )
        ufsd_printk( NULL, "possible memory allocation deadlock\n" );
      congestion_wait( BLK_RW_ASYNC, HZ/50 );
    }
  }

  if ( 1 == page_count ) {
    // A single page buffer is always mappable
    ub->addr = page_address( ub->pages[0] );
  } else {
    ub->addr = Vm_map_ram( ub->pages, ub->page_count, -1 );

    if ( !ub->addr ) {
      //
      // Undo all actions in this function
      //
      for ( i = 0; i < page_count; i++ )
        __free_page( ub->pages[i] );
      if ( ub->pages != ub->page_array )
        kfree( ub->pages );
      kfree( ub );
      return NULL;
    }
  }

  ub->offset = (unsigned long)ub->addr & (PAGE_SIZE-1);
  ub->addr  += ub->offset;

out:
//  DebugTrace( 0, 0, ("+buf: %llx + %x: %pK, %x, %x\n", ub->lbo, ub->bytes, ub->addr, ub->offset, ub->page_count ));

  return ub;
}


///////////////////////////////////////////////////////////
// ufsd_buf_free
//
//
///////////////////////////////////////////////////////////
static void
ufsd_buf_free(
    IN ufsd_buf *ub
    )
{
//  DebugTrace( 0, 0, ("-buf: %llx + %x: %pK, %x, %x\n", ub->lbo, ub->bytes, ub->addr, ub->offset, ub->page_count ));
  if ( FlagOn( ub->flags, UFSD_BUF_FLAG_PAGES ) ) {
    unsigned i;

    if ( ufsd_buf_is_vmapped( ub ) )
      vm_unmap_ram( ub->addr - ub->offset, ub->page_count );

    for ( i = 0; i < ub->page_count; i++ )
      __free_page( ub->pages[i] );
  } else if ( FlagOn( ub->flags, UFSD_BUF_FLAG_KMEM ) )
    kfree( ub->addr );

  if ( ub->pages != ub->page_array )
    kfree( ub->pages );

  kfree( ub );
}


///////////////////////////////////////////////////////////
// ufsd_buf_bio_end_io
//
//
///////////////////////////////////////////////////////////
static void
ufsd_buf_bio_end_io(
    IN struct bio *bio
    )
{
  ufsd_buf  *ub = bio->bi_private;
  int err       = bio->bi_status;

  if ( !ub->error )
    ub->error = err;

  if ( !ub->error && ufsd_buf_is_vmapped( ub ) && FlagOn( ub->flags, UFSD_BUF_FLAG_READ ) )
    invalidate_kernel_vmap_range( ub->addr, ufsd_buf_vmap_len(ub) );

  if ( 1 == atomic_dec_and_test( &ub->io_remaining ) )
    complete( &ub->iowait );

  bio_put( bio );
}


///////////////////////////////////////////////////////////
// ufsd_buf_submit
//
// Synchronous buffer IO submission path, read or write.
///////////////////////////////////////////////////////////
static int
ufsd_buf_submit(
    IN struct block_device *bdev,
    IN ufsd_buf *ub
    )
{
  struct blk_plug plug;
  int err;
  int rw                    = FlagOn( ub->flags, UFSD_BUF_FLAG_WRITE )? WRITE : READ;
  unsigned long page_index  = 0;
  unsigned long nr_pages    = ub->page_count;
  unsigned int  offset      = ub->offset;
  unsigned long bytes       = ub->bytes;
  sector_t sector           = ub->lbo >> 9;

  // clear error state
  ub->error = 0;

  atomic_inc( &ub->count );
  atomic_set( &ub->io_remaining, 1 );

  blk_start_plug(&plug);

  while ( bytes ) {
    //
    // Create new bio
    //
    struct bio  *bio = bio_alloc( bdev, min_t( unsigned, BIO_MAX_VECS, nr_pages ), rw == WRITE? REQ_OP_WRITE : REQ_OP_READ, GFP_NOFS|__GFP_HIGH ) );
    if ( !bio ) {
      ub->error = -ENOMEM;
      break;
    }

    atomic_inc( &ub->io_remaining );

    bio->bi_iter.bi_sector = sector;
    bio->bi_end_io      = ufsd_buf_bio_end_io;
    bio->bi_private     = ub;

    // Add pages
    do {
      unsigned to_add = PAGE_SIZE - offset;
      if ( to_add > bytes )
        to_add = bytes;

      if ( bio_add_page( bio, ub->pages[page_index], to_add, offset ) < to_add )
        break;

      offset       = 0;
      bytes       -= to_add;
      sector      += to_add >> 9;
      page_index  += 1;
      nr_pages    -= 1;
    } while( bytes );

    if ( ufsd_buf_is_vmapped( ub ) ) {
      flush_kernel_vmap_range( ub->addr, ufsd_buf_vmap_len( ub ) );
    }

    submit_bio( bio )
  }

  blk_finish_plug( &plug );

  // make sure we run completion synchronously if it raced with us and is already complete.
  if ( 1 == atomic_dec_and_test( &ub->io_remaining ) )
    complete( &ub->iowait );

  // wait for completion before gathering the error from the buffer
  wait_for_completion( &ub->iowait );
  err = ub->error;
  assert(!err);

  // all done now, we can release the hold that keeps the buffer referenced for the entire IO.
  if ( atomic_dec_and_test( &ub->count ) )
    ufsd_buf_free( ub );

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_buf_get
//
//
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_buf_get(
    IN  struct super_block *sb,
    IN  UINT64    offset,
    IN  unsigned  bytes,
    IN  unsigned  flags,
    OUT void      **bcb,
    OUT void      **mem
    )
{
  int err;
  ufsd_buf *ub;
  assert(0 != bytes);

  DebugTrace( 0, UFSD_LEVEL_IO, ("%s: \"%s\", %llx, %x\n", FlagOn( flags, UFSD_RW_MAP_NO_READ )? "buf_get" : "buf_read", sb->s_id, offset, bytes ));

  ub = ufsd_buf_alloc( offset, bytes );
  if ( !ub )
    err = -ENOMEM;
  else {
    if ( FlagOn( flags, UFSD_RW_MAP_NO_READ ) ) {
      memset( ub->addr, 0, bytes );
      err = 0;
    } else {
      SetFlag( ub->flags, UFSD_BUF_FLAG_READ );
      err = ufsd_buf_submit( sb->s_bdev, ub );
      assert(!err);
      if ( err )
        ufsd_buf_free( ub );
    }
  }

  if ( !err ) {
    *mem = ub->addr;
    *bcb = ub;
  }

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_buf_put
//
//
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_buf_put(
    IN struct super_block *sb,
    IN void *bcb
    )
{
  ufsd_buf *ub = bcb;

  DebugTrace( 0, UFSD_LEVEL_IO, ("buf_put: \"%s\", %llx, %d\n", sb->s_id, ub->lbo, atomic_read( &ub->count ) - 1 ));

  if ( atomic_dec_and_test( &ub->count ) )
    ufsd_buf_free( ub );
}


///////////////////////////////////////////////////////////
// ufsd_buf_write
//
//
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_buf_write(
    IN struct super_block *sb,
    IN void   *bcb,
    IN int    wait
    )
{
  int err;
  ufsd_buf *ub = bcb;

  if ( !wait && FlagOn( sb->s_flags, SB_SYNCHRONOUS ) )
    wait = UFSD_RW_WAIT_SYNC;

  DebugTrace( 0, UFSD_LEVEL_IO, ("buf_write: \"%s\", %llx, %d\n", sb->s_id, ub->lbo, atomic_read( &ub->count ) ));
  SetFlag( ub->flags, UFSD_BUF_FLAG_WRITE );

  err = ufsd_buf_submit( sb->s_bdev, ub );
  assert(!err);

  return err;
}
#endif // #if (defined UFSD_REFS1 || defined UFSD_REFS34 || defined UFSD_REFS3) && defined ufsd_buf_get


#ifdef UFSD_HFS
///////////////////////////////////////////////////////////
// ufsd_bd_lock_buffer
//
//
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_bd_lock_buffer(
    IN struct buffer_head *bh
    )
{
  assert( bh );
  assert( !buffer_locked( bh ) );
  lock_buffer( bh );
}


///////////////////////////////////////////////////////////
// ufsd_bd_unlock_buffer
//
//
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_bd_unlock_buffer(
    IN struct buffer_head *bh
    )
{
  assert( bh );
  assert( buffer_locked( bh ) );
  set_buffer_uptodate( bh );
  unlock_buffer( bh );
}
#endif


///////////////////////////////////////////////////////////
// ufsd_bd_discard
//
// Issue a discard request (trim for SSD)
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_discard(
    IN struct super_block *sb,
    IN UINT64 offset,
    IN UINT64 bytes
    )
{
  usuper *sbi = UFSD_SB( sb );
  int err;
  UINT64 start, end, len;

  if ( !test_bit( UFSD_SBI_FLAGS_DISRCARD_BIT, &sbi->flags ) || !sbi->options.discard )
    return ERR_NOTIMPLEMENTED;

  // Align up 'start' on discard_granularity
  start  = (offset + sbi->discard_granularity - 1) & sbi->discard_granularity_mask_inv;
  // Align down 'end' on discard_granularity
  end    = (offset + bytes) & sbi->discard_granularity_mask_inv;

  if ( start >= end ) {
    DebugTrace(0, UFSD_LEVEL_IO, ("discard: \"%s\", %llx, %llx -> nothing due to granularity", sb->s_id, offset, bytes ));
    return 0;
  }

  len = end - start;

  err = blkdev_issue_discard( sb->s_bdev, start >> 9, len >> 9, GFP_NOFS );

  if ( -EOPNOTSUPP == err ) {
    DebugTrace(0, 0, ("discard -> not supported"));
    clear_bit( UFSD_SBI_FLAGS_DISRCARD_BIT, &sbi->flags );
    return ERR_NOTIMPLEMENTED;
  }

  DebugTrace(0, err? 0 : UFSD_LEVEL_IO, ("discard: \"%s\", %llx, %llx (%llx, %llx) -> %d", sb->s_id, offset, bytes, start, len, err ));
  return err? ERR_BADPARAMS : 0;
}


///////////////////////////////////////////////////////////
// ufsd_bd_zero
//
// Helper function to zero blocks in block device
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_zero(
    IN struct super_block *sb,
    IN UINT64 offset,
    IN UINT64 bytes
    )
{
  int err = blkdev_issue_zeroout( sb->s_bdev, offset >> 9, bytes >> 9, GFP_NOFS, BLKDEV_ZERO_NOUNMAP );

  // must be 512 bytes aligned
  assert( !(offset&0x1ff) );
  assert( !(bytes&0x1ff) );

  DebugTrace(0, UFSD_LEVEL_IO, ("bdzero: \"%s\", %llx, %llx -> %d", sb->s_id, offset, bytes, err ));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_bd_set_blocksize
//
//
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_bd_set_blocksize(
    IN struct super_block *sb,
    IN unsigned int BytesPerBlock
    )
{
  if ( BytesPerBlock <= PAGE_SIZE ) {
    usuper *sbi = UFSD_SB( sb );
    sb_set_blocksize( sb, BytesPerBlock );
    UFSD_SB( sb )->max_block      = sbi->dev_size >> sb->s_blocksize_bits;
  }

  DebugTrace( 0, Dbg, ("BdSetBlockSize %x -> %lx", BytesPerBlock, sb->s_blocksize ));
}


///////////////////////////////////////////////////////////
// ufsd_bd_isreadonly
//
// Returns !0 for readonly media
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_isreadonly(
    IN struct super_block *sb
    )
{
  return sb_rdonly( sb );
}


///////////////////////////////////////////////////////////
// ufsd_bd_barrier
//
//
///////////////////////////////////////////////////////////
static void
ufsd_bd_barrier(
    IN struct super_block *sb
    )
{
  usuper *sbi = UFSD_SB( sb );

  if ( !sbi->options.nobarrier
    && -EOPNOTSUPP == blkdev_issue_flush( sb->s_bdev ) ) {
    printk( KERN_WARNING QUOTED_UFSD_DEVICE": disabling barriers on \"%s\" - not supported\n", sb->s_id );
    sbi->options.nobarrier = 1;
  }
}


///////////////////////////////////////////////////////////
// ufsd_bd_flush
//
//
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_flush(
    IN struct super_block *sb,
    IN unsigned wait
    )
{
  int err;

  DebugTrace( 0, Dbg, ("bdflush \"%s\"", sb->s_id ));

  err = sync_blockdev( sb->s_bdev );

  if ( !err && wait )
    ufsd_bd_barrier( sb );

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_bd_get_discard
//
// Returns the size of discard block
///////////////////////////////////////////////////////////
unsigned int
UFSDAPI_CALL
ufsd_bd_get_discard(
    IN struct super_block *sb
    )
{
  unsigned int ret = UFSD_SB( sb )->discard_granularity;
  DebugTrace( 0, Dbg, ("get_discard(\"%s\") -> %x", sb->s_id, ret ));
  return ret;
}

//
// Delayed write
//
typedef struct delay_write_inode{
  struct list_head  wlist;
  finfo       fi;
  ufsd_file   *ufile;
  unsigned    ia_valid;
  int         sync;

} delay_write_inode;


#if defined UFSD_HFS || defined UFSD_REFS3 || defined UFSD_REFS34
///////////////////////////////////////////////////////////
// ufsd_on_close_file
//
// update sbi->clear_list && sbi->write_list
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_on_close_file(
    IN struct super_block *sb,
    IN ufsd_file          *ufile
    )
{
  struct list_head *pos;
  usuper *sbi = UFSD_SB( sb );
  delay_write_inode *to_free = NULL;
  int ret = 0;

  spin_lock( &sbi->ddt_lock );
  list_for_each( pos, &sbi->write_list ) {
    delay_write_inode *dw = list_entry( pos, delay_write_inode, wlist );
    if ( dw->ufile == ufile ) {
      list_del(  pos );
      to_free = dw;
      ret = 1;
      break;
    }
  }

  list_for_each( pos, &sbi->clear_list ) {
    ufsd_file *file = (ufsd_file*)( (char*)pos - usdapi_file_to_list_offset() );
    if ( file == ufile ) {
      list_del( pos );
      INIT_LIST_HEAD( pos );
      ret |= 2;
      break;
    }
  }
  spin_unlock( &sbi->ddt_lock );

  if ( to_free )
    kfree( to_free );
  assert( !(ret & 2) ); // to debug the case
  return ret;
}
#endif


///////////////////////////////////////////////////////////
// do_delayed_tasks
//
// This function is called under locked api_mutex
///////////////////////////////////////////////////////////
static void
do_delayed_tasks(
    IN usuper *sbi
    )
{
  unsigned int cnt1, cnt2;
  int VFlush = atomic_read( &sbi->VFlush );

  if ( VFlush || ( sbi->options.sync && ufsdapi_is_volume_dirty( sbi->ufsd ) ) ) {
    ufsdapi_volume_flush( sbi->ufsd, 2 == VFlush );
    atomic_set( &sbi->VFlush, 0 );
  }

  //
  // Do delayed write
  //
  for ( cnt1 = 0; ; cnt1++ ) {
    delay_write_inode *dw;

    spin_lock( &sbi->ddt_lock );
    if ( list_empty( &sbi->write_list ) ) {
      dw = NULL;
    } else {
      dw = list_entry( sbi->write_list.next, delay_write_inode, wlist );
      list_del( &dw->wlist );
    }
    spin_unlock( &sbi->ddt_lock );

    if ( !dw )
      break;

    ufsdapi_file_flush( sbi->ufsd, dw->ufile, &dw->fi, dw->ia_valid, NULL, 0, dw->sync, NULL );
    kfree( dw );
  }

  //
  // Do delayed clear
  //
  for ( cnt2 = 0; ; cnt2++ ) {
    ufsd_file *file;
    spin_lock( &sbi->ddt_lock );
    if ( list_empty( &sbi->clear_list ) ) {
      file = NULL;
    } else {
      struct list_head *lh = sbi->clear_list.next;
      file = (ufsd_file*)( (char*)lh - usdapi_file_to_list_offset() );
      list_del( lh );
      INIT_LIST_HEAD( lh );
    }
    spin_unlock( &sbi->ddt_lock );

    if ( !file )
      break;

    ufsdapi_file_close( sbi->ufsd, file );
  }

  if ( cnt1 || cnt2 ) {
     DebugTrace( 0, Dbg, ("do_delayed_tasks: write=%u, clear=%u", cnt1, cnt2 ) );
  }
}


///////////////////////////////////////////////////////////
// _lock_ufsd
//
//
///////////////////////////////////////////////////////////
static void
_lock_ufsd(
    IN usuper *sbi,
    IN const char *hint
    )
{
  DEBUG_ONLY( unsigned long dT; )
  DEBUG_ONLY( unsigned long T0 = jiffies; )

  mutex_lock( &sbi->api_mutex );

  DEBUG_ONLY( dT         = jiffies - T0; )
  DEBUG_ONLY( WaitMutex += dT; )

#ifdef UFSD_TRACE
  if ( hint && ( ufsd_trace_level & UFSD_LEVEL_SEMA ) ) {
    si_meminfo( &sbi->sys_info );
    ufsd_trace( "%u: %lx %lx \"%s\" %s (+)",
                jiffies_to_msecs(jiffies-StartJiffies),
                sbi->sys_info.freeram, sbi->sys_info.bufferram,
                current->comm, hint );

    ufsd_trace_inc( 1 );
  }
#endif

  //
  // Perform any delayed tasks
  //
  do_delayed_tasks( sbi );
}


///////////////////////////////////////////////////////////
// try_lock_ufsd
//
// Returns 1 if mutex is locked
///////////////////////////////////////////////////////////
static int
_try_lock_ufsd(
    IN usuper *sbi,
    IN const char *hint
    )
{
  int ok = mutex_trylock( &sbi->api_mutex );
  assert( !ok || 1 == ok );

#ifdef UFSD_TRACE
  if ( hint && (ufsd_trace_level & UFSD_LEVEL_SEMA) ) {
    si_meminfo( &sbi->sys_info );
    ufsd_trace( "%u: %lx %lx \"%s\" %s %s",
                jiffies_to_msecs(jiffies-StartJiffies),
                sbi->sys_info.freeram, sbi->sys_info.bufferram,
                current->comm, hint, ok? "(+)" : "-> wait" );
    if ( ok )
      ufsd_trace_inc( 1 );
  }
#endif

  if ( !ok )
    return 0;

  //
  // Perform any delayed tasks
  //
  do_delayed_tasks( sbi );

  return 1;
}


///////////////////////////////////////////////////////////
// unlock_ufsd
//
//
///////////////////////////////////////////////////////////
static void
_unlock_ufsd(
    IN usuper *sbi,
    IN const char *hint
    )
{
  //
  // Perform any delayed tasks
  //
  do_delayed_tasks( sbi );

#ifdef UFSD_TRACE
  if ( hint && ( ufsd_trace_level & UFSD_LEVEL_SEMA ) ) {
    si_meminfo( &sbi->sys_info );
    ufsd_trace_inc( -1 );
    ufsd_trace( "%u: %lx %lx \"%s\" %s (-)",
                jiffies_to_msecs(jiffies-StartJiffies),
                sbi->sys_info.freeram, sbi->sys_info.bufferram,
                current->comm, hint );
  }
#endif

  mutex_unlock( &sbi->api_mutex );
}


#ifdef UFSD_CLOSE_AT_RELEASE
///////////////////////////////////////////////////////////
// ufsd_open_by_id
//
// Assumed lock_ufsd()
// Returns 0 if OK
///////////////////////////////////////////////////////////
static int
ufsd_open_by_id(
    IN usuper       *sbi,
    IN struct inode *i
    )
{
  finfo *fi;
  unode *u = UFSD_U(i);
  if ( u->ufile )
    return 0;

  assert( is_ntfs( sbi ) || is_hfs( sbi ) );

  if ( !ufsdapi_file_open_by_id( sbi->ufsd, i->i_ino, &u->ufile, &fi ) ) {
    assert( u->ufile );
    assert( i->i_ino == fi->Id );

    if ( S_ISDIR( i->i_mode ) == FlagOn( fi->Attrib, UFSDAPI_SUBDIR ) ) {
      //
      // This is the first request for 'inode' that requires ufsd. ufsd is locked at this moment.
      // Should we use an additional lock?
      //
      unsigned long flags;

      assert( FlagOn( fi->Attrib, UFSDAPI_SUBDIR ) || fi->ValidSize <= fi->FileSize );

      write_lock_irqsave( &u->rwlock, flags );
      // Since we read MFT here, and u->flags may contain some flags from
      // dir entry (which could contain other flags set), we need to clear
      // all UFSD_UNODE_FLAG_API_FLAGS in u->flags and then set flags from
      // fi->Attrib.
      u->flags = (u->flags & ~UFSD_UNODE_FLAG_API_FLAGS) | (fi->Attrib & UFSD_UNODE_FLAG_API_FLAGS);

      i_size_write( i, fi->FileSize );
      inode_set_bytes( i, fi->AllocSize );

      if ( !FlagOn( fi->Attrib, UFSDAPI_SUBDIR ) ) {
        set_nlink( i, fi->HardLinks );
        u->valid    = fi->ValidSize;
      }
      write_unlock_irqrestore( &u->rwlock, flags );
      return 0;
    }

    // bad inode
    ufsd_printk( i->i_sb, "Incorrect dir/file of inode r=%lx", i->i_ino );
  }

  make_bad_inode( i );
  return -ENOENT;
}
#else
#define ufsd_open_by_id( sbi, i ) 0
#endif


#if defined UFSD_NTFS && defined ufsd_get_page0
///////////////////////////////////////////////////////////
// ufsd_get_page0
//
// Fills the current user's data from page 0
///////////////////////////////////////////////////////////
unsigned  UFSDAPI_CALL
ufsd_get_page0(
    IN void   *inode,
    OUT void  *data,
    IN unsigned int bytes
    )
{
  struct inode  *i  = (struct inode*)inode;
  struct page *page = find_lock_page( i->i_mapping, 0 );
  unsigned ret = 0;
  if ( !page )
    return 0;

  if ( bytes <= PAGE_SIZE && PageUptodate( page ) && !page_has_buffers( page ) ) {
    unsigned long flags;
    unode *u    = UFSD_U( i );
    void *kaddr = kmap_local_page( page );
    memcpy( data, kaddr, bytes );
    kunmap_local(kaddr);

    // file becames resident
    write_lock_irqsave( &u->rwlock, flags );
    u->len = 0;
    inode_set_bytes( i, 0 );
    write_unlock_irqrestore( &u->rwlock, flags );

    ret  = bytes;

    if ( ret ) {
      ufsd_wait_on_page_writeback( page );
      SetPageUptodate( page );
      ClearPageDirty( page );
    }
  }
  unlock_page( page );
  DebugTrace( 0, Dbg, ("**** ufsd_get_page0 r=%lx, %x, pf=%lx -> %x", i->i_ino, bytes, page->flags, ret ));
  put_page( page );
  return ret;
}
#endif


#ifdef UFSD_USE_SPARSE
///////////////////////////////////////////////////////////
// ufsd_sparse_cluster
//
// Helper function to zero a new allocated clusters
///////////////////////////////////////////////////////////
noinline static void
ufsd_sparse_cluster(
    IN struct inode   *i,
    IN struct page    *page0,
    IN loff_t         vbo,
    IN unsigned int   bytes
    )
{
  struct address_space *mapping = i->i_mapping;
  struct super_block *sb = i->i_sb;
  usuper  *sbi        = UFSD_SB( sb );
  unsigned blocksize  = 1 << i->i_blkbits;
  pgoff_t  idx0       = page0? page0->index : -1;
  // Align on cluster boundary down
  loff_t   vbo_clst   = vbo & sbi->cluster_mask_inv;
  // Align on cluster boundary up
  loff_t   end        = ((vbo + bytes + sbi->bytes_per_cluster - 1) & sbi->cluster_mask_inv);
  pgoff_t  idx        = vbo_clst >> PAGE_SHIFT;
  unsigned from       = vbo_clst & (PAGE_SIZE - 1);
  pgoff_t  idx_end    = (end + PAGE_SIZE - 1) >> PAGE_SHIFT;

  DebugTrace( 0, Dbg, ("ufsd_sparse_cluster r=%lx: [%llx + %x)", i->i_ino, vbo, bytes ));

  for ( ; idx < idx_end; idx += 1, from = 0 ) {
    loff_t page_off;
    unsigned to, partial;
    struct buffer_head *head, *bh;

    struct folio* folio = idx == idx0? page_folio( page0 ) : __filemap_get_folio(
      mapping, idx, FGP_LOCK | FGP_ACCESSED | FGP_CREAT,
      mapping_gfp_constraint(mapping, ~__GFP_FS));

    if ( !folio ) {
      DebugTrace( 0, Dbg, ("**** ufsd_sparse_cluster (%x) -> NULL", (unsigned)idx ));
      continue;
    }

    page_off  = (loff_t)idx << PAGE_SHIFT;
    to        = (page_off + PAGE_SIZE) > end? (end - page_off) : PAGE_SIZE;
    partial   = 0;
    head      = folio_buffers( folio );

    if ( from || PAGE_SIZE != to ) {
      assert( sbi->bytes_per_cluster < PAGE_SIZE );
      if ( !head )
        head = create_empty_buffers( folio, blocksize, 0 );
    }

    if ( head ) {
      unsigned bh_off = 0;

      bh = head;
      do {
        unsigned bh_next  = bh_off + blocksize;
        if ( from <= bh_off && bh_next <= to ) {
          set_buffer_uptodate( bh );
          mark_buffer_dirty( bh );
        } else if ( !buffer_uptodate(bh) )
          partial = 1;
        bh_off = bh_next;
      } while( head != (bh = bh->b_this_page) );
    }

    folio_zero_segment( folio, from, to );

    if ( !partial ) {
      atomic_inc( &sbi->dirty_pages_count );
      folio_mark_uptodate(folio);
      folio_mark_dirty(folio);
    }

    if ( idx != idx0 ) {
      folio_unlock( folio );
      folio_put( folio );
      cond_resched();
    }
  }
  DebugTrace( 0, Dbg, ("ufsd_sparse_cluster ->" ));

  mark_inode_dirty( i );
}
#endif


///////////////////////////////////////////////////////////
// update_cached_size
//
// Update unode fields about sizes
// NOTE: It does not change inode->i_size
///////////////////////////////////////////////////////////
static inline void
update_cached_size(
    IN usuper         *sbi,
    IN unode          *u,
    IN loff_t         i_size,
    IN const UINT64   *asize
    )
{
  unsigned long flags;

  write_lock_irqsave( &u->rwlock, flags );

  if ( asize )
    inode_set_bytes( &u->i, *asize );

  if ( u->len ) {
    loff_t dvbo = i_size - u->vbo;
    if ( dvbo <= 0 ) {
      u->vbo  = u->lbo  = u->len  = 0;
    } else if ( dvbo < u->len ) {
      u->len  = ((i_size + sbi->cluster_mask ) & sbi->cluster_mask_inv) - u->vbo;
    }
  }

  write_unlock_irqrestore( &u->rwlock, flags );
}


///////////////////////////////////////////////////////////
// ufsd_set_size_ufsd
//
// Helper function to truncate/expand file
///////////////////////////////////////////////////////////
static int
ufsd_set_size_ufsd(
    IN struct inode *i,
    IN UINT64 old_size,
    IN UINT64 new_size
    )
{
  usuper *sbi = UFSD_SB( i->i_sb );
  unode *u    = UFSD_U( i );
  int err;

  lock_ufsd( sbi );

  //
  // Check for maximum file size. NOTE: sparse and normal file have different maximums  //
  //
  if ( new_size > ( is_sparsed_or_compressed( u )? sbi->maxbytes_sparse : sbi->maxbytes ) ) {
    err = -EFBIG;
  } else {
    //
    // Call UFSD library
    //
    UINT64 allocated;
    err = ufsdapi_file_set_size( u->ufile, new_size, NULL, &allocated );
    if ( !err )
      update_cached_size( sbi, u, new_size, &allocated );
  }

  unlock_ufsd( sbi );

  return err;
}


typedef struct mapinfo{
  UINT64    lbo;    // Logical byte offset
  UINT64    len;    // Length of map in bytes
  unsigned  flags;  // Properties of fragment
} mapinfo;


///////////////////////////////////////////////////////////
// vbo_to_lbo
//
// Maps block to read/write
//  sbi - superblock pointer
//  u - unode pointer
//  vbo - starting virtual byte offset to get vbo->lbo
//    mapping
//  length - length of fragment to be mapped (in bytes)
//  map - pointer to struct where mapping will be saved
//
// Returns 0 on success, and non-zero on error.
///////////////////////////////////////////////////////////
static int
vbo_to_lbo(
    IN usuper   *sbi,
    IN unode    *u,
    IN loff_t   vbo,
    IN loff_t   length,
    OUT mapinfo *map
    )
{
  int err;
  unsigned long flags;
  loff_t dvbo;
  mapinfo2 map2;

  //
  // Check cached info
  //
  read_lock_irqsave( &u->rwlock, flags );

  dvbo = vbo - u->vbo;
  if ( 0 <= dvbo && dvbo <= u->len ) {
    map->len = u->len - dvbo;
    if ( is_lbo_ok( u->lbo ) ) {
      map->lbo = u->lbo + dvbo;
    } else {
      map->lbo = u->lbo;
      if ( length )
        map->len = 0;
    }

#if defined UFSD_REFS34 || defined UFSD_REFS3
    if ( FlagOn( u->fpr, UFSD_MAP_LBO_NOTINITED | UFSD_MAP_LBO_CLONED ) && length )
      map->len = 0;
#endif

  } else {
    map->len = 0;
  }
  map->flags = u->fpr;

  read_unlock_irqrestore( &u->rwlock, flags );

  if ( map->len > 0 && map->len >= length ) {
//    DebugTrace( 0, Dbg, ("vbo_to_lbo (cache) r=%lx, o=%llx, sz=%llx,%llx,%llx, f=%x  -> %llx + %llx",
//                          u->i.i_ino, vbo, u->valid, u->i.i_size, u->vbo + u->len, map->flags, map->lbo, map->len ));

    if ( is_lbo_ok( map->lbo )
      && ( map->lbo >= sbi->dev_size || (map->lbo + map->len) > sbi->dev_size ) ) {
      ufsd_printk( sbi->sb, "vbo_to_lbo (cache): r=%lx, o=%llx, sz=%llx,%llx: lbo %llx + %llx >= dev_size %llx",
                   u->i.i_ino, vbo, u->valid, u->i.i_size, map->lbo, map->len, sbi->dev_size );
      map->len = 0;
      return -EIO;
    }

    return 0;
  }

  lock_ufsd( sbi );

  // At this point, unode *u may be closed (1), but vbo_to_lbo()
  // can be called during writepages, and it needs opened unode.
  // (1): it may be closed in ufsd_file_release() in if branch for NTFS & HFS
  //      (when number of readers and writers == 0) by the call to
  //      ufsdapi_file_close().
  err = ufsdapi_file_map( u->ufile, vbo, length,
                          length? UFSD_MAP_VBO_CREATE : 0,
                          &map2 );

  if ( likely( !err ) ) {
    write_lock_irqsave( &u->rwlock, flags );
    u->vbo = vbo - map2.head;
    u->lbo = is_lbo_ok( map2.lbo )? (map2.lbo - map2.head) : map2.lbo;
    u->len = map2.len + map2.head;
    u->fpr = map2.flags  & ~UFSD_MAP_LBO_NEW;
    inode_set_bytes( &u->i, map2.alloc );
    write_unlock_irqrestore( &u->rwlock, flags );

    map->lbo    = map2.lbo;
    map->len    = map2.len;
    map->flags  = map2.flags;

    if ( is_lbo_ok( map->lbo )
      && ( map->lbo >= sbi->dev_size || (map->lbo + map->len) > sbi->dev_size ) ) {
      ufsd_printk( sbi->sb, "vbo_to_lbo (on-disk): r=%lx, o=%llx, sz=%llx,%llx: lbo %llx + %llx >= dev_size %llx",
                   u->i.i_ino, vbo, u->valid, u->i.i_size, map2.lbo, map2.len, sbi->dev_size );
      map->len = 0;
      err = -EIO;
    }

//    assert( u->vbo + u->len <= ((u->i.i_size + sbi->cluster_mask ) & sbi->cluster_mask_inv) );
//    DebugTrace( 0, Dbg, ("vbo_to_lbo r=%lx, o=%llx, sz=%llx,%llx,%llx, f=%x  -> %llx + %llx",
//                          u->i.i_ino, vbo, u->valid, u->i.i_size, u->vbo + u->len, map->flags, map->lbo, map->len ));
  } else {
    map->len = 0;
  }

  unlock_ufsd( sbi );

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_dir_llseek
//
// file_operations::llseek
///////////////////////////////////////////////////////////
static loff_t
ufsd_dir_llseek(
    IN struct file *file,
    IN loff_t       offset,
    IN int          whence
    )
{
  struct inode *i = file_inode( file );
  usuper *sbi     = UFSD_SB( i->i_sb );
  loff_t ret;

  assert( offset >= 0 );
  if ( SEEK_SET == whence && offset >= sbi->end_of_dir ) {
    file->f_pos     = offset;
    ret             = offset;
  } else {
    ret = generic_file_llseek( file, offset, whence );
  }

//  DebugTrace( 0, Dbg, ("dir_llseek: (r=%lx, %llx, %d) -> %llx\n", i->i_ino, offset, whence, ret ));

  return ret;
}


///////////////////////////////////////////////////////////
// ufsd_readdir
//
// file_operations::readdir
///////////////////////////////////////////////////////////
static int
ufsd_readdir(
    IN struct file *file,
    IN struct dir_context *ctx
    )
{
  struct inode *i         = file_inode( file );
  unode *u                = UFSD_U( i );
  struct super_block *sb  = i->i_sb;
  usuper *sbi             = UFSD_SB( sb );
  UINT64 pos              = ctx->pos;
  ufsd_search *DirScan    = NULL;
  DEBUG_ONLY( char buf[64]; )

  if ( pos >= sbi->end_of_dir ) {
    DebugTrace( 0, Dbg, ("readdir: %s, %llx -> no more", fname( i, buf ), pos ));
    return 0;
  }

  DebugTrace( +1, Dbg, ("readdir: %s, %llx", fname( i, buf ), pos ));

  if ( sbi->options.showdots ) {
    if (!dir_emit_dots(file, ctx))
      goto out;
    pos = ctx->pos;
  }

  lock_ufsd( sbi );
  assert( u->ufile );

  if ( !ufsdapi_find_open( sbi->ufsd, u->ufile, pos, &DirScan ) ) {

    ufsd_direntry de;

    //
    // Enumerate UFSD's direntries
    //
    while ( !ufsdapi_find_get( DirScan, &pos, &de ) ) {

      unsigned dt;

      if ( FlagOn( de.attrib, UFSDAPI_UGM ) ) {
        if ( S_ISREG( de.mode ) )
          dt = DT_REG;
        else if ( S_ISDIR( de.mode ) )
          dt = DT_DIR;
        else if ( S_ISCHR( de.mode ) )
          dt = DT_CHR;
        else if ( S_ISBLK( de.mode ) )
          dt = DT_BLK;
        else if ( S_ISFIFO( de.mode ) )
          dt = DT_FIFO;
        else if ( S_ISSOCK( de.mode ) )
          dt = DT_SOCK;
        else if ( S_ISLNK( de.mode ) )
          dt = DT_LNK;
        else
          dt = DT_REG;
      } else if ( FlagOn( de.attrib, UFSDAPI_SUBDIR ) )
        dt = DT_DIR;
      else
        dt = DT_REG;

      ctx->pos = pos;

      if ( !dir_emit( ctx, de.name, de.namelen, (ino_t)de.ino, dt ) )
        break;

//      DebugTrace( 0, Dbg, ("%llu -> r=%lx,%lu \"%s\"", pos, de.ino, de.ino, de.name ));
    }

    ufsdapi_find_close( DirScan );
  }

  unlock_ufsd( sbi );

out:
  //
  // Save position and return
  //
  ctx->pos = pos;

  DebugTrace( -1, Dbg, ("readdir -> 0 (next=%llx)", pos));
  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_preopen_file
//
// helper function
///////////////////////////////////////////////////////////
static int
ufsd_preopen_file(
    IN usuper *sbi,
    IN unode  *u
    )
{
  int err = 0;

  if ( !u->ufile ) {
    lock_ufsd( sbi );
    err = ufsd_open_by_id( sbi, &u->i );
    unlock_ufsd( sbi );
    if ( err )
      return err;
  }

  if ( test_and_clear_bit( UFSD_UNODE_FLAG_LAZY_INIT_BIT, &u->flags ) && u->ufile) {
    mapinfo2 map;
    lock_ufsd( sbi );
    if ( likely( !( err = ufsdapi_file_map( u->ufile, 0, 0, 0, &map ) ) ) ) {
      unsigned long flags;
      write_lock_irqsave( &u->rwlock, flags );
      u->vbo = 0;
      u->lbo = map.lbo;
      u->len = map.len;
      u->fpr = map.flags;
      write_unlock_irqrestore( &u->rwlock, flags );
    }
    unlock_ufsd( sbi );
  }

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_file_open
//
// file_operations::open
///////////////////////////////////////////////////////////
static int
ufsd_file_open(
    IN struct inode *i,
    IN struct file  *file
    )
{
  usuper *sbi = UFSD_SB( i->i_sb );
  unode *u    = UFSD_U( i );
  TRACE_ONLY( struct dentry *de = file_dentry(file); )
  TRACE_ONLY( const char *hint=""; )
  int err;

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  assert( file->f_mapping == i->i_mapping && "Check kernel config!" );
  VfsTrace( +1, Dbg, ("file_open: r=%lx, '%.*s', l=%x, f=%pK, fl=o%o%s%s",
                i->i_ino, (int)de->d_name.len, de->d_name.name, i->i_nlink, file, file->f_flags,
                FlagOn( file->f_flags, O_DIRECT )?",d":"", FlagOn( file->f_flags, O_APPEND )?",a":""));

  // increment before 'ufsd_preopen_file'
  atomic_inc( &u->i_opencount );

  // Check file size
  err = generic_file_open( i, file );
  if ( likely( !err ) )
    err = ufsd_preopen_file( sbi, u );

  if ( unlikely( err ) ) {
    TRACE_ONLY( hint="failed"; )
  } else if ( unlikely( ( is_compressed( u ) || is_encrypted( u ) ) && FlagOn( file->f_flags, O_DIRECT ) ) ) {
    TRACE_ONLY( hint="failed to open compressed file with O_DIRECT"; )
    err = -ENOTBLK;
  } else if ( is_dedup( u ) && (file->f_flags & (O_WRONLY | O_RDWR | O_TRUNC))) {
    // dedup file readonly
    TRACE_ONLY( hint="failed to open dedup file with O_DIRECT"; )
    err = -EOPNOTSUPP;
  }

  if ( unlikely( err ) ) {
    VfsTrace( -1, Dbg, ("file_open -> %s, %d", hint, err));
    atomic_dec( &u->i_opencount );
    return err;
  }

#ifdef UFSD_USE_STREAM
  assert( !file->private_data );
  if ( sbi->options.delim ) {
#ifndef UFSD_TRACE
    struct dentry *de = file_dentry(file);
#endif
    char *p = strchr( de->d_name.name, sbi->options.delim );
    if ( p ) {
      if ( 0 == i->i_nlink && 1 == atomic_read( &u->i_opencount ) ){
        atomic_dec( &u->i_opencount );
        VfsTrace( -1, Dbg, ("file_open -> stream in deleted file"));
        return -ENOENT;
      }
      igrab( i );
      dget( de );
      file->private_data = p + 1;
      assert( is_stream( file ) );
      TRACE_ONLY( hint="(stream)"; )
    }
  }
#endif

  VfsTrace( -1, Dbg, ("file_open%s -> ok%s, sz=%llx,%llx", hint, is_compressed( u )?", c" : "", u->valid, i->i_size ));

  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_update_ondisk
//
// Stores information from inode into ufsd_sdk format
///////////////////////////////////////////////////////////
static unsigned
ufsd_update_ondisk(
    IN usuper       *sbi,
    IN struct inode *i,
    OUT finfo       *fi
    )
{
  unode *u  = UFSD_U( i );
  struct timespec64 atime = inode_get_atime(i);
  struct timespec64 ctime = inode_get_ctime(i);
  struct timespec64 mtime = inode_get_mtime(i);
  loff_t fsize;

  if ( u->stored_noacsr ) {
    fi->Uid   = __kuid_val( u->i_uid );
    fi->Gid   = __kgid_val( u->i_gid );
    fi->Mode  = u->i_mode;
  } else {
    fi->Uid   = __kuid_val( i->i_uid );
    fi->Gid   = __kgid_val( i->i_gid );
    fi->Mode  = i->i_mode;
  }

#if 0
  DebugTrace( 0, Dbg, ("update_ondisk (r=%lx): m=%o, t=%lx+%lu, %lx+%lu, %lx+%lu, s=%llx",
                      i->i_ino, (unsigned)i->i_mode,
                      atime.tv_sec, atime.tv_nsec,
                      mtime.tv_sec, mtime.tv_nsec,
                      ctime.tv_sec, ctime.tv_nsec,
                      i->i_size ));
#endif

#ifdef UFSD_USE_POSIX_TIME
  if ( is_posixtime( sbi ) )
  {
    fi->ReffTime    = kernel2posix( &atime );
    fi->ChangeTime  = kernel2posix( &ctime );
    fi->ModiffTime  = kernel2posix( &mtime );
  }
  else
#endif
  {
#ifdef UFSD_USE_NT_TIME
    fi->ReffTime    = kernel2nt( &atime );
    fi->ChangeTime  = kernel2nt( &ctime );
    fi->ModiffTime  = kernel2nt( &mtime );
#endif
  }

  if ( is_compressed( u ) )
    return ATTR_UID | ATTR_GID | ATTR_MODE | ATTR_CTIME | ATTR_MTIME | ATTR_ATIME;

  //
  // Ask ufsd to update on-disk valid/size
  //
  fi->ValidSize = get_valid_size( u, &fsize, NULL );
  fi->FileSize  = fsize;
  return ATTR_SIZE | ATTR_UID | ATTR_GID | ATTR_MODE | ATTR_CTIME | ATTR_MTIME | ATTR_ATIME;
}


///////////////////////////////////////////////////////////
// ufsd_file_release
//
// file_operations::release
///////////////////////////////////////////////////////////
static int
ufsd_file_release(
    IN struct inode *i,
    IN struct file  *file
    )
{
  TRACE_ONLY( const char *hint=""; )
  struct super_block *sb  = i->i_sb;
  unode *u = UFSD_U( i );
  int err = 0;

  // 'release' should be called for each success 'open'
  assert( atomic_read( &u->i_opencount ) >= 1 );

#ifdef UFSD_USE_STREAM
  if ( is_stream( file ) ) {
    dput( file_dentry(file) );
    iput( i );
    TRACE_ONLY( hint="(stream)"; )
  } else
#endif
  {
    usuper *sbi = UFSD_SB( sb );
    UNREFERENCED_PARAMETER( sbi );

    // if we are the last writer on the inode, drop the block reservation
    if ( FlagOn( file->f_mode, FMODE_WRITE )
      && 1 == atomic_read( &i->i_writecount ) ) {

      UINT64 allocated;
      inode_lock( i );
      lock_ufsd( sbi );

      err = ufsdapi_file_flush( sbi->ufsd, u->ufile, sbi->fi, ufsd_update_ondisk( sbi, i, sbi->fi ), i, 0, 0, &allocated );
      assert(!err);
      if ( !is_compressed( u ) )
        update_cached_size( sbi, u, i->i_size, S_ISREG(i->i_mode)? &allocated : NULL );

      spin_lock( &i->i_lock );
      i->i_state &= ~(I_DIRTY_SYNC | I_DIRTY_DATASYNC);
      spin_unlock( &i->i_lock );

      unlock_ufsd( sbi );
      inode_unlock( i );

      TRACE_ONLY( hint="(updated)"; )
    }

#ifdef UFSD_CLOSE_AT_RELEASE
    //
    // Free resources if last handle closed for directories on NTFS & HFS.
    //
    if ( ( is_ntfs( sbi ) )
        && S_ISDIR( i->i_mode ) && 1 == atomic_read( &u->i_opencount ) ) {

      ufsd_file *fh;
      spin_lock( &i->i_lock );
      fh = u->ufile;
      u->ufile = NULL;
      spin_unlock( &i->i_lock );
      assert( fh );
      if ( fh ) {
        int err2;
        lock_ufsd( sbi );
        err2 = ufsdapi_file_close( sbi->ufsd, fh );
        unlock_ufsd( sbi );
        assert(!err2);
        if (!err && err2)
          err = err2;
      }

      TRACE_ONLY( hint="(closed)"; )
    }
#endif
  }

  atomic_dec( &u->i_opencount );

  VfsTrace( 0, Dbg, ("file_release%s: -> r=%lx, f=%pK, z=%d",
        hint, i->i_ino, file, atomic_read( &u->i_opencount ) ));

  return err;
}


#ifdef UFSD_TRACE
///////////////////////////////////////////////////////////
// ufsd_file_fsync
//
// file_operations::fsync
///////////////////////////////////////////////////////////
static int
ufsd_file_fsync(
    IN struct file *file,
    IN loff_t start,
    IN loff_t end,
    IN int datasync
    )
{
  int err;
  char buf[64];
  struct inode *i = file_inode( file );

  VfsTrace( +1, Dbg, ("fsync: %s, [%llx %llx), %d", fname( i, buf ), start, end, datasync ));

  err = generic_file_fsync( file, start, end, datasync );

  VfsTrace( -1, Dbg, ("fsync -> %d", err ));
  return err;
}
#else
#define ufsd_file_fsync generic_file_fsync
#endif


///////////////////////////////////////////////////////////
// ufsd_fiemap
//
// file_operations::fiemap
///////////////////////////////////////////////////////////
static int
ufsd_fiemap(
    IN struct inode *i,
    IN struct fiemap_extent_info *fieinfo,
    IN __u64 start,
    IN __u64 len
    )
{
  int err;
  unode *u    = UFSD_U( i );
  usuper *sbi = UFSD_SB( i->i_sb );
  u64 end, next;
  mapinfo map;
  unsigned int flags;

  VfsTrace( +1, Dbg, ("fiemap: r=%lx, [%llx + %llx), fl=%x, sz=%llx,%llx", i->i_ino, start, len, fieinfo->fi_flags, u->valid, i->i_size ));
  assert( !fieinfo->fi_extents_mapped );

  if ( FlagOn( fieinfo->fi_flags, FIEMAP_FLAG_XATTR ) ) {
    err = -EOPNOTSUPP;
    goto out;
  }

  inode_lock( i );

  err = 0;
  end = start + len;
  if ( end > i->i_size )
    end = i->i_size;

  for ( ; start < end; start = next ) {

    err = vbo_to_lbo( sbi, u, start, 0, &map );
    if ( err )
      break;

    if ( !map.len ) {
      assert( 0 );
      err = -EINVAL; // ?
      break;
    }

    next = start + map.len;

    if ( UFSD_VBO_LBO_HOLE == map.lbo ) {
      DebugTrace( 0, Dbg, ("hole: [%llx + %llx)", start, map.len ));
      continue;
    }

    flags = UFSD_VBO_LBO_RESIDENT == map.lbo
      ? FIEMAP_EXTENT_DATA_INLINE
      : UFSD_VBO_LBO_COMPRESSED == map.lbo
      ? FIEMAP_EXTENT_ENCODED
      : UFSD_VBO_LBO_ENCRYPTED == map.lbo
      ? FIEMAP_EXTENT_DATA_ENCRYPTED
      : 0;

    if ( FlagOn( map.flags, UFSD_MAP_LBO_NOTINITED ) )
      SetFlag( flags, FIEMAP_EXTENT_UNWRITTEN );

    if ( next > end ) {
      map.len = end - start;
      next    = end;
    }

    if ( next <= u->valid )
      ;
    else if ( start >= u->valid ) {
      SetFlag( flags, FIEMAP_EXTENT_UNWRITTEN );
    } else {
      u64 dlen = u->valid - start;

      if ( u->valid >= end )
        flags |= FIEMAP_EXTENT_LAST;

      DebugTrace( 0, Dbg, ("pre_unwr: %llx -> %llx + %llx, %x", start, map.lbo, dlen, flags ));

      err = fiemap_fill_next_extent( fieinfo, start, map.lbo, dlen, flags | FIEMAP_EXTENT_MERGED );

      if ( err < 0 )
        break;
      if ( 1 == err ) {
        err = 0;
        break;
      }

      start   += dlen;
      map.len -= dlen;
      if ( !map.len )
        continue;

      map.lbo += dlen;
      SetFlag( flags, FIEMAP_EXTENT_UNWRITTEN );
    }

    if ( next >= end )
      flags |= FIEMAP_EXTENT_LAST;

    DebugTrace( 0, Dbg, ("%llx -> %llx + %llx, %x", start, map.lbo, map.len, flags ));

    err = fiemap_fill_next_extent( fieinfo, start, map.lbo, map.len, flags | FIEMAP_EXTENT_MERGED );

    if ( err < 0 )
      break;
    if ( 1 == err ) {
      err = 0;
      break;
    }
  }

  inode_unlock( i );

#if 0
  if ( fieinfo->fi_extents_max ){
    unsigned k;
    struct fiemap_extent __user *fe = fieinfo->fi_extents_start;
    for ( k = 0; k < fieinfo->fi_extents_mapped; k++, fe++ ) {
      DebugTrace( 0, Dbg, ("%u: %llx -> %llx + %llx, %x", k, fe->fe_logical, fe->fe_physical, fe->fe_length, fe->fe_flags ));
    }
  }
#endif

out:
  VfsTrace( -1, Dbg, ("fiemap -> %d, ext=%x", err, fieinfo->fi_extents_mapped ));

  return err;
}


#ifndef VFAT_IOCTL_GET_VOLUME_ID
  #define VFAT_IOCTL_GET_VOLUME_ID  _IOR('r', 0x12, __u32)
#endif

///////////////////////////////////////////////////////////
// ufsd_ioctl
//
// file_operations::ioctl
///////////////////////////////////////////////////////////
noinline static long
ufsd_ioctl(
    IN struct file    *file,
    IN unsigned int   cmd,
    IN unsigned long  arg
    )
{
  struct inode *i = file_inode( file );
  struct super_block *sb = i->i_sb;
  int err = 0;
  unsigned ioctl  = _IOC_NR( cmd );
  unsigned insize = _IOC_DIR( cmd ) & _IOC_WRITE? _IOC_SIZE( cmd ) : 0;
  unsigned osize  = _IOC_DIR( cmd ) & _IOC_READ? _IOC_SIZE( cmd ) : 0;
  void *final_buffer = NULL;
  size_t BytesReturned;
  usuper *sbi  = UFSD_SB( sb );
  finfo *fi;
  unode *u = UFSD_U( i );
  TRACE_ONLY( struct dentry *de = file_dentry(file); )

  VfsTrace( +1, Dbg,("ioctl: ('%.*s'), r=%lx, m=%o, f=%pK, cmd=%08x",
                       (int)de->d_name.len, de->d_name.name,
                       i->i_ino, i->i_mode, file, cmd ));

  if ( VFAT_IOCTL_GET_VOLUME_ID == cmd ) {
    //
    // Special code
    //
    err = ufsdapi_query_volume_id( sbi->ufsd );
    VfsTrace( -1, Dbg, ("ioctl (VFAT_IOCTL_GET_VOLUME_ID ) -> %x", (unsigned)err));
    return err;
  }

  switch( cmd ) {
  case UFSD_IOC_GETSIZES:
  case UFSD_IOC_SETVALID:
  case UFSD_IOC_SETTIMES:
  case UFSD_IOC_GETTIMES:
  case UFSD_IOC_SETATTR:
  case UFSD_IOC_GETATTR:
  case UFSD_IOC_GETMEMUSE:
  case UFSD_IOC_GETVOLINFO:
  case UFSD_IOC_CREATE_USN:
  case UFSD_IOC_DELETE_USN:
  case UFSD_IOC_GETCOMPR:
  case UFSD_IOC_SETCOMPR:
  case UFSD_IOC_GETSPARSE:
  case UFSD_IOC_SETSPARSE:
    break;
#if defined UFSD_REFS34 || defined UFSD_REFS3
  case FS_IOC_GETFLAGS:
    err = put_user( FlagOn( i->i_flags, S_IMMUTABLE )? FS_IMMUTABLE_FL : 0, (int __user *) arg );
    goto out;

  case FS_IOC_SETFLAGS:

    // Use 'err' to get new flags
    if ( get_user( err, (int __user *) arg ) ) {
      err = -EFAULT;
      goto out;
    }

    if ( !FlagOn( i->i_flags, S_IMMUTABLE ) || FlagOn( err, FS_IMMUTABLE_FL ) ) {
      err = -EOPNOTSUPP;
      goto out;
    }

    ioctl = UFSD_IOC_CODE_DROP_INTERGITY;
    break;
#endif

  case FITRIM:
    if ( !capable( CAP_SYS_ADMIN ) ) {
      err = -EPERM;
      goto out;
    }

    if ( !sbi->discard_granularity ) {
      ufsd_printk( sb, "looks like device \"%s\" does not support trim", sb->s_id );
      err = -EOPNOTSUPP;
      goto out;
    }

    ioctl = UFSD_IOC_CODE_TRIM_RANGE;
    break;

  case UFSD_IOC_GETDEDUP:
    err = is_dedup(u);
    if ( copy_to_user( (__user void *)arg, &err, sizeof(err) ) )
      err = -EFAULT;
    else
      err = 0;
    goto out;

  default:
    if ( 'f' == _IOC_TYPE( cmd ) ) {
      switch( ioctl ) {
        case UFSD_IOC_CODE_GET_SECURITY:
        case UFSD_IOC_CODE_SET_SECURITY:
          goto Ok;
      }
    }

    VfsTrace( -1, Dbg, ("ioctl(%x) -> '-ENOTTY'", ioctl));
    return -ENOTTY;
  }

Ok:
  final_buffer = ufsd_heap_alloc( max_t(unsigned, insize, osize), 0 );
  if ( !final_buffer ) {
    err = -ENOMEM;
    goto out;
  }

  if ( copy_from_user( final_buffer, (__user void*)arg, insize) ) {
    err = -EFAULT;
  } else {

    assert( i );
    assert( UFSD_VOLUME(sb) );

    if ( UFSD_IOC_GETSIZES == cmd ) {
      loff_t *s = (loff_t*)final_buffer;

      s[2] = get_valid_size( u, s+1, s+0 );
      s[3] = is_sparsed_or_compressed( u )? inode_get_bytes( i ) : 0; // The sum of the allocated clusters for a compressed file
      err  = 0;
    } else {
      char discard;

      //
      // And call the library.
      //
      lock_ufsd( sbi );

      discard = sbi->options.discard;
      if ( UFSD_IOC_CODE_TRIM_RANGE == ioctl ){
        struct fstrim_range* trange = final_buffer;

        if ( trange->start >= sbi->dev_size ){
          assert(0);
          err = -EINVAL;
          goto out1;
        }

        if ( -1 != trange->len && trange->start + trange->len > sbi->dev_size )
          trange->len = -1;

        sbi->options.discard = 1; // allow discard requests
      }

      err = ufsdapi_ioctl( sbi->ufsd, u->ufile, ioctl, final_buffer, insize, osize, &BytesReturned, &fi );

      if ( !err ) {
        switch( cmd ) {
        case UFSD_IOC_SETTIMES:
          ufsd_times_to_inode( sbi, fi, i );
          mark_inode_dirty( i );
          break;
        case UFSD_IOC_SETVALID:
          set_valid_size( u, fi->ValidSize );
          mark_inode_dirty( i );
          break;
        case UFSD_IOC_SETATTR:
          mark_inode_dirty( i );
          break;
        case UFSD_IOC_SETSPARSE:
          SetFlag( u->flags, UFSD_UNODE_FLAG_SPARSE );
          break;
        case UFSD_IOC_SETCOMPR:
          SetFlag( u->flags, UFSD_UNODE_FLAG_COMPRESS );
          break;
        }
      } else if ( -ERANGE == err ) {
        err = -EOVERFLOW;
      }

      sbi->options.discard = discard; // restore mount option "discard"

out1:
      unlock_ufsd( sbi );
    }
    if ( copy_to_user( (__user void *)arg, final_buffer, osize ) )
      err = -EFAULT;
  }

  ufsd_heap_free( final_buffer );

#if defined UFSD_REFS34 || defined UFSD_REFS3
  if ( !err && FS_IOC_SETFLAGS == cmd )
    i->i_flags &= ~S_IMMUTABLE;
#endif

out:
  VfsTrace( -1, Dbg, ("ioctl(%x) -> %d", ioctl, err));
  return err;
}


static const struct file_operations ufsd_dir_operations = {
  .llseek         = ufsd_dir_llseek,
  .read           = generic_read_dir,
  .iterate_shared = ufsd_readdir,
  .fsync          = ufsd_file_fsync,
  .open           = ufsd_file_open,
  .release        = ufsd_file_release,
  .unlocked_ioctl = ufsd_ioctl,
  .compat_ioctl   = compat_ptr_ioctl,
};


///////////////////////////////////////////////////////////
// ufsd_d_hash
//
// dentry_operations::d_hash
///////////////////////////////////////////////////////////
static int
ufsd_d_hash(
    IN const struct dentry *de,
    IN struct qstr         *name
    )
{
  usuper *sbi = UFSD_SB( de->d_sb );
  const unsigned char *n  = name->name;
  unsigned int len  = name->len;
  unsigned int c;
  unsigned long hash;
  DEBUG_ONLY( sbi->nHashCalls += 1; )

#ifdef UFSD_HFS
  if ( !sbi->options.nocase ) {
    assert( is_hfs( sbi ) );
    for ( ;; ) {
      if ( !len-- )
        return 0; // as is

      c = *n++;
      if ( c >= 0x80 )
        break;
    }
  } else
#endif
  {
    hash  = (unsigned long)de; // init_name_hash( de );
    for ( ;; ) {
      if ( !len-- ) {
        hash = end_name_hash( hash );
        goto out;
      }

      c = *n++;
      if ( c >= 0x80 )
        break;

      hash = partial_name_hash( tolower( c ), hash );
    }
  }

  DEBUG_ONLY( sbi->nHashCallsUfsd += 1; )

  spin_lock( &sbi->nocase_lock );
  hash = ufsdapi_names_hash( sbi->ufsd, name->name, name->len );
  spin_unlock( &sbi->nocase_lock );

out:
  name->hash = hash;
  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_d_compare
//
// dentry_operations::d_compare
// return 0 if names match
///////////////////////////////////////////////////////////
static int
ufsd_d_compare(
    IN const struct dentry *de,
    IN unsigned int         len1,
    IN const char          *str,
    IN const struct qstr   *name
    )
{
  int ret;
  usuper *sbi             = UFSD_SB( de->d_sb );
  const unsigned char *n1 = (unsigned char*)str;
  const unsigned char *n2 = name->name;
  unsigned int len2       = name->len;
  unsigned int lm         = min( len1, len2 );
  unsigned char c1, c2;
  DEBUG_ONLY( sbi->nCompareCalls += 1; )

#ifdef UFSD_HFS
  if ( !sbi->options.nocase ) {
    assert( is_hfs( sbi ) );
    for ( ;; ) {
      if ( !lm-- ) {
        ret = len1 == len2? 0 : 1;
        goto out;
      }

      if ( (c1 = *n1++) == (c2 = *n2++) )
        continue;

      if ( c1 >= 0x80 || c2 >= 0x80 )
        break;

      ret = 1;
      goto out;
    }
  } else
#endif
  {
    for ( ;; ) {
      if ( !lm-- ) {
        ret = len1 == len2? 0 : 1;
        goto out;
      }

      if ( (c1 = *n1++) == (c2 = *n2++) )
        continue;

      if ( c1 >= 0x80 || c2 >= 0x80 )
        break;

      if ( tolower( c1 ) != tolower( c2 ) ) {
        ret = 1;
        goto out;
      }
    }
  }

  DEBUG_ONLY( sbi->nCompareCallsUfsd += 1; )

  spin_lock( &sbi->nocase_lock );
  ret = 1 == ufsdapi_names_equal( sbi->ufsd, str, len1, name->name, len2 )? 0 : 1;
  spin_unlock( &sbi->nocase_lock );

out:
  return ret;
}


static struct dentry_operations ufsd_dop = {
  .d_hash     = ufsd_d_hash,
  .d_compare  = ufsd_d_compare,
};


// Forward declaration
static struct inode*
ufsd_create_or_open (
    IN struct inode       *dir,
    IN OUT struct dentry  *de,
    IN ucreate            *cr
    );

///////////////////////////////////////////////////////////
// ufsd_create
//
// create/open use the same helper.
// inode_operations::create
///////////////////////////////////////////////////////////
static int
ufsd_create(
    IN struct mnt_idmap *idmap,
    IN struct inode   *dir,
    IN struct dentry  *de,
    IN umode_t        mode,
    IN bool           namei
    )
{
  struct inode *i;
  ucreate  cr = { NULL, NULL, 0, 0, 0, mode };

  if ( IS_ERR( i = ufsd_create_or_open( dir, de, &cr ) ) )
    return PTR_ERR( i );

  d_instantiate( de, i );

  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_mkdir
//
// inode_operations::mkdir
///////////////////////////////////////////////////////////
static
#if is_decl( MKDIR_V2 )
struct dentry*
#else
int
#endif
ufsd_mkdir(
    IN struct mnt_idmap *idmap,
    IN struct inode   *dir,
    IN struct dentry  *de,
    IN umode_t        mode
    )
{
  ucreate  cr = { NULL, NULL, 0, 0, 0, mode | S_IFDIR };
  struct inode *i = ufsd_create_or_open( dir, de, &cr );

  if ( IS_ERR( i ) ){
    int err = PTR_ERR( i );
#if is_decl( MKDIR_V2 )
    return ERR_PTR(err);
#else
    return err;
#endif
  }

  d_instantiate( de, i );

  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_unlink
//
// inode_operations::unlink
// inode_operations::rmdir
///////////////////////////////////////////////////////////
static int
ufsd_unlink(
    IN struct inode   *dir,
    IN struct dentry  *de
    )
{
  int err;
  UINT64 dir_size   = 0;
  struct inode *i   = de->d_inode;
  usuper *sbi       = UFSD_SB( i->i_sb );
  struct qstr *s    = &de->d_name;
  unode  *u         = UFSD_U( i );
#ifdef UFSD_USE_STREAM
  unsigned char *p  = sbi->options.delim? strchr( s->name, sbi->options.delim ) : NULL;
  const char *sname;
  int flen, slen;

  if ( !p ) {
    flen  = s->len;
    sname = NULL;
    slen  = 0;
  } else {
    flen  = p - s->name;
    sname = p + 1;
    slen  = s->name + s->len - p - 1;
  }
#else
  int flen = s->len;
  const char *sname = NULL;
  int slen = 0;
#endif

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  VfsTrace( +1, Dbg, ("unlink: r=%lx, ('%.*s'), r=%lx, l=%x,%d, de=%pK",
              dir->i_ino, (int)s->len, s->name, i->i_ino, i->i_nlink, atomic_read( &u->i_opencount ), de ));

  assert( i->i_nlink );

  lock_ufsd( sbi );

  // ufsdapi_unlink() requires ufsd object to be opened; make sure that it is
  // opened (1).
  // (1): it may be closed in ufsd_file_release() in if branch for NTFS & HFS
  //      (when number of readers and writers == 0) by the call to
  //      ufsdapi_file_close().
  err = ufsd_open_by_id( sbi, dir );
  if ( likely( !err ) ) {
    // If file is not opened, it is assumed that hard-link count for that file
    // is 1. But it may happen, that real hard-link count value is > 1. When
    // we unlink such file, we decrement hard-link count (it becomes 0), but
    // there are other directory entries point to the same inode (MFT).
    // unlink()'ing all entries for such file lead to wrong hard-link count
    // (it gets decremented from 1 to 0, and then from 0 it underflows to
    // 0xffffffff).
    //
    // Fix this by ufsd_open_by_id()'ing the file.
    err = ufsd_open_by_id( sbi, i );
    if ( likely( !err ) ) {
      err = ufsdapi_unlink( sbi->ufsd, UFSD_FH( dir ), s->name, flen, sname, slen,
                            1 == i->i_nlink && !atomic_read( &u->i_opencount ),
                            &u->ufile, &dir_size );
      if ( !err && !u->ufile ) {
        i_size_write( i, 0 );
        DebugTrace( 0, Dbg, ("unlink immediate r=%lx,", i->i_ino ));
      }
    }
  }

  unlock_ufsd( sbi );

  if ( unlikely( err ) ) {
    switch( err ) {
    case -ENOTEMPTY:
    case -ENOSPC:
    case -EROFS:
    case -EOPNOTSUPP:
      break;
    default:
      make_bad_inode( i );
    }
    goto out;
  }

#ifdef UFSD_USE_STREAM
  if ( !sname )
#endif
  {
    drop_nlink( i );

    // Mark dir as requiring resync.
    // i->i_ctime = dir->i_mtime = dir->i_ctime = ...;
    inode_set_mtime_to_ts(dir, inode_set_ctime_to_ts(dir, inode_set_ctime_to_ts(i, ufsd_inode_current_time( sbi ) )));
    i_size_write( dir, dir_size );
    inode_set_bytes( dir, dir_size );
    mark_inode_dirty( dir );
    if ( i->i_nlink )
      mark_inode_dirty( i );
  }

  if ( ( is_hfs( sbi ) || is_apfs( sbi )) && S_ISDIR( i->i_mode ) ) {
    assert(dir->i_nlink > 0);
    drop_nlink( dir );
    mark_inode_dirty( dir );
  }

out:
  VfsTrace( -1, Dbg, ("unlink -> %d", err));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_set_size
//
// Helper function
///////////////////////////////////////////////////////////
static int
ufsd_set_size(
    IN struct inode *i,
    IN UINT64 old_size,
    IN UINT64 new_size
    )
{
  int err;
  unode *u  = UFSD_U( i );
  TRACE_ONLY( const char *hint = new_size >= old_size? "expand":"truncate"; )
  unsigned long flags;

  VfsTrace( +1, Dbg, ("%s: r=%lx, sz=%llx,%llx -> %llx%s", hint, i->i_ino, u->valid, old_size, new_size, is_sparsed( u )?" ,sp" : "" ) );

  assert( inode_is_locked( i ) );

  // If truncate update valid size first
  write_lock_irqsave( &u->rwlock, flags );
  if ( new_size < u->valid )
    u->valid = new_size;
  write_unlock_irqrestore( &u->rwlock, flags );

  if ( new_size < old_size ) {
    // Change in-memory size before ufsd
    truncate_setsize( i, new_size );
  }

  err = ufsd_set_size_ufsd( i, old_size, new_size );

  if ( unlikely( err ) ) {
    if ( new_size < old_size )
      i_size_write( i, old_size );  // Restore inode size if error

    VfsTrace( -1, Dbg, ("%s failed -> %d", hint, err ) );
    return err;
  }

  if ( new_size > old_size )
    truncate_setsize( i, new_size );  // Change in-memory size after ufsd

  VfsTrace( -1, Dbg, ("%s r=%lx, sz=%llx,%llx, ok", hint, i->i_ino, u->valid, i->i_size ) );

  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_setattr
//
// inode_operations::setattr
///////////////////////////////////////////////////////////
static int
ufsd_setattr(
    IN struct mnt_idmap *idmap,
    IN struct dentry *de,
    IN struct iattr  *attr
    )
{
  int err;
  struct inode *i = de->d_inode;
  struct super_block *sb = i->i_sb;
#if defined UFSD_USE_SPARSE || defined UFSD_TRACE || defined UFSD_USE_STREAM
  unode *u        = UFSD_U( i );
#endif
  usuper *sbi     = UFSD_SB( sb );
  unsigned int ia_valid = attr->ia_valid;
  struct timespec64 ts;

  if ( unlikely(ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  VfsTrace( +1, Dbg, ("setattr(%x): r=%lx, \"%s\", uid=%d,gid=%d,m=%o,sz=%llx,%llx",
                        ia_valid, i->i_ino, de->d_name.name, __kuid_val(i->i_uid), __kgid_val(i->i_gid), i->i_mode,
                        u->valid, i->i_size ));

  if ( sbi->options.no_acs_rules ) {
    // "no access rules" - force any changes of time etc.
    SetFlag( attr->ia_valid, ATTR_FORCE );
    // and disable for editing some attributes
    ClearFlag( attr->ia_valid, UFSD_NOACSR_ATTRS );
    ia_valid = attr->ia_valid;
  }

  err = setattr_prepare( idmap, de, attr );

  if ( err ) {
#ifdef UFSD_DEBUG
    unsigned int fs_uid   = __kuid_val( current_fsuid() );
    DebugTrace( 0, Dbg, ("inode_change_ok failed: \"%s\" current_fsuid=%d, ia_valid=%x", current->comm, fs_uid, ia_valid ));
    if ( FlagOn( ia_valid, ATTR_UID ) )
      DebugTrace( 0, Dbg, ("new uid=%d, capable(CAP_CHOWN)=%d", __kuid_val( attr->ia_uid ), capable(CAP_CHOWN) ));

    if ( FlagOn( ia_valid, ATTR_GID ) )
      DebugTrace( 0, Dbg, ("new gid=%d, in_group_p=%d, capable(CAP_CHOWN)=%d", __kgid_val( attr->ia_gid ), in_group_p(attr->ia_gid), capable(CAP_CHOWN) ));

    if ( FlagOn( ia_valid, ATTR_MODE ) )
      DebugTrace( 0, Dbg, ("new mode=%o", (unsigned)attr->ia_mode ));

#ifndef ATTR_TIMES_SET
  #define ATTR_TIMES_SET  (1 << 16)
#endif
    if ( ia_valid & (ATTR_MTIME_SET | ATTR_ATIME_SET | ATTR_TIMES_SET) )
      DebugTrace( 0, Dbg, ("new times"));
#endif
    goto out;
  }

#ifdef UFSD_USE_STREAM
  {
    const unsigned char *p = sbi->options.delim? strchr( de->d_name.name, sbi->options.delim ) : NULL;
    if ( NULL != p ){
      //
      // Only size of ADS is allowed to change here
      //
      if ( FlagOn( ia_valid, ATTR_SIZE ) ) {
        lock_ufsd( sbi );
        err = ufsdapi_setsize_ads( sbi->ufsd, u->ufile, p + 1, de->d_name.name + de->d_name.len - p - 1, attr->ia_size );
        unlock_ufsd( sbi );
      }
      goto out;
    }
  }
#endif

  if ( FlagOn( ia_valid, ATTR_SIZE ) ) {
    if ( attr->ia_size == i->i_size )
      ClearFlag( ia_valid, ATTR_SIZE );
    else {
      if ( unlikely( is_encrypted( u ) ) ) {
        DebugTrace( 0, UFSD_LEVEL_ERROR, ("setattr: attempt to resize encrypted file" ) );
        err = -ENOSYS;
        goto out;
      }

      inode_dio_wait( i );

      err = ufsd_set_size( i, i->i_size, attr->ia_size );
      if ( err )
        goto out;
      inode_set_mtime_to_ts( i, inode_set_ctime_to_ts( i, ufsd_inode_current_time( sbi ) ) );
    }
  }

  //
  // Update inode info
  //
  if ( FlagOn( ia_valid, ATTR_UID ) )
    i->i_uid = attr->ia_uid;

  if ( FlagOn( ia_valid, ATTR_GID ) )
    i->i_gid = attr->ia_gid;

  if ( FlagOn( ia_valid, ATTR_ATIME ) ) {
    ts = inode_get_atime(i);
#if defined UFSD_FAT
    if ( is_fat( sbi ) ) {
      // fat access time - one day
      UINT64 ad, id;
      int bias = 60 * (-1 == sbi->options.bias? sys_tz.tz_minuteswest : sbi->options.bias);
      ad       = attr->ia_atime.tv_sec - bias;
      do_div(ad, 24*60*60);
      id       = ts.tv_sec - bias;
      do_div(id, 24*60*60);
      if ( ad != id ) {
        ts.tv_sec   = ad * (24*60*60) + bias;
        ts.tv_nsec  = 0;
        inode_set_atime_to_ts( i, ts );
      } else {
        ClearFlag( ia_valid, ATTR_ATIME );
      }
    } else
#endif
    if ( ufsd_time_trunc( sbi, &attr->ia_atime, &ts ) )
      inode_set_atime_to_ts( i, ts );
    else
      ClearFlag( ia_valid, ATTR_ATIME );
  }

  if ( FlagOn( ia_valid, ATTR_MTIME ) ){
    ts = inode_get_mtime(i);
    if ( ufsd_time_trunc( sbi, &attr->ia_mtime, &ts ) )
      inode_set_mtime_to_ts( i, ts );
    else
      ClearFlag( ia_valid, ATTR_MTIME );
  }

  if ( FlagOn( ia_valid, ATTR_CTIME ) ) {
    ts = inode_get_ctime(i);
    if ( ufsd_time_trunc( sbi, &attr->ia_ctime, &ts ) )
      inode_set_ctime_to_ts( i, ts );
    else
      ClearFlag( ia_valid, ATTR_CTIME );
  }

  if ( FlagOn( ia_valid, ATTR_MODE ) ) {
    umode_t mode = attr->ia_mode;
//    DebugTrace( 0, Dbg, ("mode %o -> %o", i->i_mode, mode ));
    if ( !in_group_p( i->i_gid ) && !capable( CAP_FSETID ) )
      mode &= ~S_ISGID;

    if ( mode == i->i_mode )
      ClearFlag( ia_valid, ATTR_MODE );
    else {
      i->i_mode = mode;
#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
      if ( (is_ntfs( sbi ) || is_hfs( sbi ) || is_apfs( sbi ) || is_xfs( sbi ) ) && sbi->options.acl ) {
        DebugTrace( +1, Dbg, ("acl_chmod r=%lx, m=%o", i->i_ino, i->i_mode));
        if ( S_ISLNK( i->i_mode ) )
          err = -EOPNOTSUPP;
        else
          err = posix_acl_chmod( idmap, de, i->i_mode );
        DebugTrace( -1, Dbg, ("acl_chmod -> %d", err));
      }
#endif
    }
  }

out:
  if ( ia_valid & (ATTR_SIZE | ATTR_UID | ATTR_GID | ATTR_ATIME | ATTR_MTIME | ATTR_CTIME | ATTR_MODE ) ) {
    mark_inode_dirty_sync( i );
  }

  VfsTrace( -1, Dbg, ("setattr -> %d, uid=%d,gid=%d,m=%o,sz=%llx,%llx%s", err,
                        __kuid_val(i->i_uid), __kgid_val(i->i_gid), i->i_mode,
                        u->valid, i->i_size, FlagOn(i->i_state, I_DIRTY)?",d":"" ));

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_getattr
//
// inode_operations::getattr
///////////////////////////////////////////////////////////
static int
ufsd_getattr(
    IN struct mnt_idmap *idmap,
    IN const struct path *path,
    OUT struct kstat *stat,
    IN u32 request_mask,
    IN unsigned int flags
    )
{
  struct dentry *de = path->dentry;
  struct inode *i = de->d_inode;
  unode *u = UFSD_U( i );

  stat->result_mask  |= STATX_BTIME;
  stat->btime  = u->i_crtime;

  stat->blksize = UFSD_SB( i->i_sb )->bytes_per_cluster; /* 512, 1K, ..., 2M */

  if ( i->i_flags & S_IMMUTABLE )
    stat->attributes |= STATX_ATTR_IMMUTABLE;

  if ( i->i_flags & S_APPEND )
    stat->attributes |= STATX_ATTR_APPEND;

  if ( is_compressed( u ) )
    stat->attributes |= STATX_ATTR_COMPRESSED;

  if ( is_encrypted( u ) )
    stat->attributes |= STATX_ATTR_ENCRYPTED;

  stat->attributes_mask |= STATX_ATTR_COMPRESSED | STATX_ATTR_ENCRYPTED
                          | STATX_ATTR_IMMUTABLE | STATX_ATTR_APPEND;

  generic_fillattr( idmap, request_mask, i, stat );

#if 0
  DebugTrace( 0, Dbg, ("getattr (r=%llx): m=%o, t=%lx+%lu, %lx+%lu, %lx+%lu, s=%llx, b=%llx",
                      stat->ino, (unsigned)stat->mode,
                      (long)stat->atime.tv_sec, stat->atime.tv_nsec,
                      (long)stat->mtime.tv_sec, stat->mtime.tv_nsec,
                      (long)stat->ctime.tv_sec, stat->ctime.tv_nsec,
                      stat->size, stat->blocks ));
#endif

#if 0
  DebugTrace( 0, Dbg, ("getattr (r=%llx): m=%o, s=%llx, b=%llx",
                      stat->ino, (unsigned)stat->mode,
                      stat->size, stat->blocks ));
#endif

  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_fileattr_get
//
// inode_operations::fileattr_get
///////////////////////////////////////////////////////////
static int
ufsd_fileattr_get(
    IN struct dentry *dentry,
    OUT struct fileattr *fa
    )
{
  struct inode *i = d_inode(dentry);
#ifdef UFSD_USE_SPARSE
  unode *u        = UFSD_U( i );
#endif
  u32 flags       = 0;

  if ( i->i_flags & S_IMMUTABLE )
    flags |= FS_IMMUTABLE_FL;

  if ( i->i_flags & S_APPEND )
    flags |= FS_APPEND_FL;

  if ( is_compressed( u ) )
    flags |= FS_COMPR_FL;

  if ( is_encrypted( u ) )
    flags |= FS_ENCRYPT_FL;

  fileattr_fill_flags( fa, flags );

  DebugTrace( 0, Dbg, ("fileattr_get -> r=%lx, %x", i->i_ino, fa->flags));
  return 0;
}

///////////////////////////////////////////////////////////
// ufsd_fileattr_set
//
// inode_operations::fileattr_set
///////////////////////////////////////////////////////////
static int
ufsd_fileattr_set(
    IN struct mnt_idmap *idmap,
    IN struct dentry *dentry,
    IN struct fileattr *fa
    )
{
  struct inode *i     = d_inode(dentry);
  u32 flags           = fa->flags;
  unsigned int new_fl = 0;

  if ( fileattr_has_fsx( fa ) )
    return -EOPNOTSUPP;

  if ( flags & ~( FS_IMMUTABLE_FL | FS_APPEND_FL ) )
    return -EOPNOTSUPP;

  if ( flags & FS_IMMUTABLE_FL )
    new_fl |= S_IMMUTABLE;

  if ( flags & FS_APPEND_FL )
    new_fl |= S_APPEND;

  inode_set_flags( i, new_fl, S_IMMUTABLE | S_APPEND );

  inode_set_ctime_current( i );
  mark_inode_dirty( i );

  DebugTrace( 0, Dbg, ("fileattr_set(r=%lx, %x) -> %x", i->i_ino, flags, i->i_flags));
  return 0;
}


///////////////////////////////////////////////////////////
// ufsd_rename
//
// inode_operations::rename
///////////////////////////////////////////////////////////
static int
ufsd_rename(
    IN struct mnt_idmap *idmap,
    IN struct inode   *odir,
    IN struct dentry  *ode,
    IN struct inode   *ndir,
    IN struct dentry  *nde,
    IN unsigned int flags
    )
{
  int err;
  usuper *sbi = UFSD_SB( odir->i_sb );
  UINT64 odir_size = 0, ndir_size = 0;
  struct timespec64 ctime;

  if (flags & ~RENAME_NOREPLACE)
    return -EINVAL;
  assert( 0 == flags || (flags & RENAME_NOREPLACE));

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  VfsTrace( +1, Dbg, ("rename: r=%lx, %pK('%.*s') -> r=%lx, %pK('%.*s')",
                      odir->i_ino, ode,
                      (int)ode->d_name.len, ode->d_name.name,
                      ndir->i_ino, nde,
                      (int)nde->d_name.len, nde->d_name.name ));

  //
  // If the target already exists, delete it first.
  // I will not unwind it on move failure. Although it's a weak point
  // it's better to not have it implemented then trying to create
  // a complex workaround.
  //
  if ( nde->d_inode ) {
    DebugTrace( 0, Dbg, ("rename: deleting existing target %pK (r=%lx)", nde->d_inode, nde->d_inode->i_ino));
    if (flags & RENAME_NOREPLACE){
      assert(0); // should be already checked for local filesystems?
      VfsTrace( -1, Dbg, ("rename: -> failed to delete existing target, cause RENAME_NOREPLACE"));
      return -EEXIST;
    }
    dget( nde );
    err = ufsd_unlink( ndir, nde );
    dput( nde );
    assert(!err||-ENOTEMPTY==err);
    if ( unlikely( err ) )
      goto out;
  }

  lock_ufsd( sbi );

  err = ufsd_open_by_id( sbi, odir );
  assert(!err);
  if ( likely( !err ) ) {
    err = ufsd_open_by_id( sbi, ndir );
    assert(!err);
    if ( likely( !err ) ) {
      err = ufsd_open_by_id( sbi, ode->d_inode );
      assert(!err);
      if ( likely( !err ) ) {
        err = ufsdapi_file_move( sbi->ufsd, UFSD_FH( odir ), UFSD_FH( ndir ), UFSD_FH( ode->d_inode ),
                                 ode->d_name.name, ode->d_name.len,
                                 nde->d_name.name, nde->d_name.len,
                                 &odir_size, &ndir_size );
        assert(!err);
      }
    }
  }

  unlock_ufsd( sbi );

  if ( unlikely( err ) )
    goto out;

  // Mark dir as requiring resync.
  ctime = ufsd_inode_current_time( sbi );
  inode_set_ctime_to_ts( odir, ctime );
  inode_set_mtime_to_ts( odir, ctime );
  mark_inode_dirty( odir );
  mark_inode_dirty( ndir );
  i_size_write( odir, odir_size );
  inode_set_bytes( odir, odir_size );

  if ( ndir != odir ) {
    inode_set_mtime_to_ts( ndir, ctime );
    i_size_write( ndir, ndir_size );
    inode_set_bytes( ndir, ndir_size );

    if ( ( is_hfs( sbi ) || is_apfs( sbi )) && S_ISDIR( ode->d_inode->i_mode ) ) {
      assert(odir->i_nlink > 0);
      drop_nlink( odir );
      inc_nlink( ndir );
    }
  }

  if ( ode->d_inode ) {
    inode_set_ctime_to_ts( ode->d_inode, ctime );
    mark_inode_dirty( ode->d_inode );
  }

out:
  VfsTrace( -1, Dbg, ("rename -> %d", err));
  return err;
}


#ifdef UFSD_USE_XATTR
///////////////////////////////////////////////////////////
// ufsd_getxattr_hlp
//
// Helper function
///////////////////////////////////////////////////////////
noinline static int
ufsd_getxattr_hlp(
    IN  struct inode  *i,
    IN  const char    *name,
    OUT void          *value,
    IN  size_t        size,
    OUT size_t        *required
    )
{
  unode *u    = UFSD_U( i );
  usuper *sbi = UFSD_SB( i->i_sb );
  int ret;
  size_t len;

  if ( u->ufile && !FlagOn( u->flags, UFSD_UNODE_FLAG_EA ) )
    return -ENODATA;

  if ( !required )
    lock_ufsd( sbi );

  ret = ufsd_open_by_id( sbi, i );
  assert(!ret);
  if ( likely( !ret ) )
    ret = ufsdapi_get_xattr( sbi->ufsd, u->ufile, name, strlen(name), value, size, &len );
  if ( !ret ) {
    ret = (int)len;
  } else {
    // ERR_NOFILEEXISTS -> -ENOENT -> -ENODATA
    if ( -ENOENT == ret )
      ret = -ENODATA;
    else if ( -ERANGE == ret && required )
      *required = len;
  }

  if ( !required )
    unlock_ufsd( sbi );

  return ret;
}


///////////////////////////////////////////////////////////
// ufsd_setxattr_hlp
//
// Helper function
///////////////////////////////////////////////////////////
noinline static int
ufsd_setxattr_hlp(
    IN struct inode *i,
    IN const char   *name,
    IN const void   *value,
    IN size_t       size,
    IN int          flags,
    IN int          locked
    )
{
  unode *u    = UFSD_U( i );
  usuper *sbi = UFSD_SB( i->i_sb );
  int ret;
  C_ASSERT( 1 == XATTR_CREATE && 2 == XATTR_REPLACE );

  if ( !locked )
    lock_ufsd( sbi );

  ret = ufsd_open_by_id( sbi, i );
  if ( likely( !ret ) )
    ret = ufsdapi_set_xattr( sbi->ufsd, u->ufile, name, strlen(name), value, size, flags );
  if ( !ret ) {
    // Check if we delete the last xattr ( !size && XATTR_REPLACE == flags && no xattrs )
    if ( size
      || XATTR_REPLACE != flags
      || ufsdapi_list_xattr( sbi->ufsd, u->ufile, NULL, 0, &size )
      || size ) {
      set_bit( UFSD_UNODE_FLAG_EA_BIT, &u->flags );
    } else {
      clear_bit( UFSD_UNODE_FLAG_EA_BIT, &u->flags );
      DebugTrace( 0, UFSD_LEVEL_XATTR, ("setxattr: (removed last extended attribute)" ));
    }
    // Ok, ret is already 0
  } else {
    // ERR_NOFILEEXISTS -> -ENOENT -> -ENODATA
    if ( -ENOENT == ret )
      ret = -ENODATA;
  }

  if ( !locked )
    unlock_ufsd( sbi );

  return ret;
}

#ifdef CONFIG_FS_POSIX_ACL

static inline void
ufsd_posix_acl_release(
    IN struct posix_acl *acl
    )
{
  if ( acl && refcount_dec_and_test( &acl->a_refcount ) )
    kfree( acl );
}


///////////////////////////////////////////////////////////
// ufsd_get_acl_ex
//
// Helper function for ufsd_get_acl
///////////////////////////////////////////////////////////
static struct posix_acl*
ufsd_get_acl_ex(
    IN struct inode *i,
    IN int          type,
    IN int          locked
    )
{
  const char *name;
  struct posix_acl *acl;
  size_t req;
  int ret;
  usuper *sbi = UFSD_SB( i->i_sb );
  DEBUG_ONLY( const char *hint = ""; )
  DEBUG_ONLY( char buf[64]; )

  DebugTrace( +1, Dbg, ("ufsd_get_acl: %s, %d, %d", fname( i, buf ), type, locked ));

  assert( sbi->options.acl );

  //
  // Possible values of 'type' was already checked above
  //
  name = ACL_TYPE_ACCESS == type? XATTR_NAME_POSIX_ACL_ACCESS : XATTR_NAME_POSIX_ACL_DEFAULT;

  if ( !locked )
    lock_ufsd( sbi );

  //
  // Get the size of extended attribute
  //
  req = 0; // make clang happy
  ret = ufsd_getxattr_hlp( i, name, sbi->x_buffer, sbi->bytes_per_xbuffer, &req );

  if ( (ret > 0 && !sbi->x_buffer) || -ERANGE == ret ) {

    //
    // Allocate/Reallocate buffer and read again
    //
    if ( sbi->x_buffer ) {
      assert( -ERANGE == ret );
      kfree( sbi->x_buffer );
    }

    if ( ret > 0 )
      req = ret;

    sbi->x_buffer = kmalloc( req, GFP_NOFS );
    if ( sbi->x_buffer ) {
      sbi->bytes_per_xbuffer = req;

      //
      // Read the extended attribute.
      //
      ret = ufsd_getxattr_hlp( i, name, sbi->x_buffer, sbi->bytes_per_xbuffer, &req );
      assert( ret > 0 );

    } else {
      ret = -ENOMEM;
      sbi->bytes_per_xbuffer = 0;
    }
  }

  if ( !locked )
    unlock_ufsd( sbi );

  //
  // Translate extended attribute to acl
  //
  if ( ret > 0 ) {
    acl = posix_acl_from_xattr( ufsd_ns, sbi->x_buffer, ret );
    if ( !IS_ERR( acl ) )
      set_cached_acl( i, type, acl );
  } else {
    acl = -ENODATA == ret || -ENOSYS == ret ? NULL : ERR_PTR( ret );
  }

  DEBUG_ONLY( hint = "ufsd"; )

  DebugTrace( -1, Dbg, ("ufsd_get_acl -> %pK, %s", acl, hint ));
  return acl;
}


///////////////////////////////////////////////////////////
// ufsd_set_acl_ex
//
// Helper function
///////////////////////////////////////////////////////////
static int
ufsd_set_acl_ex(
    IN struct inode     *i,
    IN struct posix_acl *acl,
    IN int              type,
    IN int              locked,
    IN bool             init_acl
    )
{
  const char *name;
  void *value = NULL;
  size_t size = 0;
  int err     = 0;

  if ( S_ISLNK( i->i_mode ) )
    return -EOPNOTSUPP;

  assert( UFSD_SB( i->i_sb )->options.acl );

  switch( type ) {
    case ACL_TYPE_ACCESS:
      if ( acl && !init_acl ) {
        umode_t mode = i->i_mode;
        err = posix_acl_equiv_mode( acl, &mode );
        if ( err < 0 )
          return err;

        if ( i->i_mode != mode ) {
          i->i_mode = mode;
          mark_inode_dirty( i );
        }
        if ( !err )
          acl = NULL; // acl can be exactly represented in the traditional file mode permission bits
      }
      name = XATTR_NAME_POSIX_ACL_ACCESS;
      break;

    case ACL_TYPE_DEFAULT:
      if ( !S_ISDIR( i->i_mode ) )
        return acl ? -EACCES : 0;
      name = XATTR_NAME_POSIX_ACL_DEFAULT;
      break;

    default:
      return -EINVAL;
  }

  if ( acl ) {
    size  = posix_acl_xattr_size( acl->a_count );
    value = kmalloc( size, GFP_NOFS );
    if ( !value )
      return -ENOMEM;

    err = posix_acl_to_xattr( ufsd_ns, acl, value, size );
    if ( err < 0 )
      return err;
  }

  err = ufsd_setxattr_hlp( i, name, value, size, 0, locked );
  if ( !err )
    set_cached_acl( i, type, acl );

  kfree( value );

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_permission
//
// inode_operations::permission
///////////////////////////////////////////////////////////
static int
ufsd_permission(
    IN struct mnt_idmap* idmap,
    IN struct inode *i,
    IN int          mask
    )
{
  usuper *sbi   = UFSD_SB( i->i_sb );

  if ( sbi->options.no_acs_rules ) {
    // "no access rules" mode - allow all changes
    return 0;
  }
  //
  // Call default function
  //
  return generic_permission( idmap, i, mask );
}


///////////////////////////////////////////////////////////
// ufsd_xattr_get_acl
//
// Helper function for ufsd_xattr_acl_access_get/ufsd_xattr_acl_default_get
///////////////////////////////////////////////////////////
static int
ufsd_xattr_get_acl(
    IN struct dentry* de,
    IN int          type,
    OUT void        *buffer,
    IN size_t       size
    )
{
  struct posix_acl *acl;
  int err;
  struct inode *i = de->d_inode;

  if ( !UFSD_SB( i->i_sb )->options.acl )
    return -EOPNOTSUPP;

  acl = ufsd_get_acl_ex( i, type, 0 );
  if ( IS_ERR( acl ) )
    return PTR_ERR( acl );

  if ( !acl )
    return -ENODATA;

  err = posix_acl_to_xattr( ufsd_ns, acl, buffer, size );
  ufsd_posix_acl_release( acl );

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_xattr_set_acl
//
// Helper function for ufsd_xattr_acl_access_set/ufsd_xattr_acl_default_set
///////////////////////////////////////////////////////////
static int
ufsd_xattr_set_acl(
    IN struct inode *i,
    IN int          type,
    IN const void   *value,
    IN size_t       size
    )
{
  struct posix_acl *acl;
  struct super_block *sb = i->i_sb;
  int err;

  if ( !UFSD_SB( sb )->options.acl )
    return -EOPNOTSUPP;

  if ( !value )
    acl = NULL;
  else {
    acl = posix_acl_from_xattr( ufsd_ns, value, size );
    if ( IS_ERR( acl ) )
      return PTR_ERR(acl);

    if ( acl ) {
      err = posix_acl_valid( sb->s_user_ns, acl );
      if ( err )
        goto release_and_out;
    }
  }

  err = ufsd_set_acl_ex( i, acl, type, 0, false );

release_and_out:
  ufsd_posix_acl_release( acl );
  return err;
}
#else
  #define ufsd_permission NULL
#endif // #ifdef CONFIG_FS_POSIX_ACL
#else
  #define ufsd_setxattr_hlp( ... ) -EOPNOTSUPP
  #define ufsd_getxattr_hlp( ... ) -EOPNOTSUPP
  #define ufsd_permission NULL
#endif // #ifdef UFSD_USE_XATTR

#define UFSD_XATTR_SYSTEM_DOS_ATTRIB         "system.dos_attrib"
#define UFSD_XATTR_SYSTEM_DOS_ATTRIB_LEN     ( sizeof( UFSD_XATTR_SYSTEM_DOS_ATTRIB ) - 1 )
#define UFSD_XATTR_SYSTEM_NTFS_ATTRIB        "system.ntfs_attrib"
#define UFSD_XATTR_SYSTEM_NTFS_ATTRIB_LEN    ( sizeof( UFSD_XATTR_SYSTEM_NTFS_ATTRIB ) - 1 )
#define UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE     "system.ntfs_attrib_be"
#define UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE_LEN ( sizeof( UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE ) - 1 )

#define SAMBA_PROCESS_NAME                   "smbd"
#define SAMBA_PROCESS_NAME_LEN               ( sizeof( SAMBA_PROCESS_NAME ) - 1 )
#define UFSD_XATTR_USER_DOSATTRIB            "user.DOSATTRIB"
#define UFSD_XATTR_USER_DOSATTRIB_LEN        ( sizeof( UFSD_XATTR_USER_DOSATTRIB ) - 1 )


///////////////////////////////////////////////////////////
// ufsd_getxattr
//
// inode_operations::getxattr
///////////////////////////////////////////////////////////
static int
ufsd_getxattr(
    IN const struct xattr_handler *handler,
    IN struct dentry  *de,
    IN struct inode   *i,
    IN const char     *name,
    OUT void          *buffer,
    IN size_t         size
    )
{
  int err;
  unode *u        = UFSD_U( i );
  usuper *sbi     = UFSD_SB( i->i_sb );
  size_t name_len = strlen( name );
  unsigned int attr_len;
  TRACE_ONLY( char buf[64]; )

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  VfsTrace( +1, UFSD_LEVEL_XATTR, ("getxattr: %s, \"%s\", %zu", fname( i, buf ), name, size ));

  //
  // Dispatch request
  //
  if ( is_msfs( sbi )
    && ( ( UFSD_XATTR_SYSTEM_DOS_ATTRIB_LEN == name_len
        && ( attr_len  = sizeof(unsigned char), !memcmp( name, UFSD_XATTR_SYSTEM_DOS_ATTRIB, UFSD_XATTR_SYSTEM_DOS_ATTRIB_LEN + 1 ) ) )
      || ( UFSD_XATTR_SYSTEM_NTFS_ATTRIB_LEN == name_len
        && ( attr_len  = sizeof(unsigned int), !memcmp( name, UFSD_XATTR_SYSTEM_NTFS_ATTRIB, UFSD_XATTR_SYSTEM_NTFS_ATTRIB_LEN + 1 ) ) )
      || ( UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE_LEN == name_len
        && ( attr_len  = sizeof(unsigned int), !memcmp( name, UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE, UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE_LEN + 1 ) ) )
      || ( UFSD_XATTR_USER_DOSATTRIB_LEN == name_len
        && ( attr_len  = 0x40,
             !memcmp( current->comm, SAMBA_PROCESS_NAME, SAMBA_PROCESS_NAME_LEN + 1 )
          && !memcmp( name, UFSD_XATTR_USER_DOSATTRIB, UFSD_XATTR_USER_DOSATTRIB_LEN + 1 ) ) ) ) ) {

    unsigned int attrib, o;
    __u16 ver1;

    // dos_attrib
    if ( !buffer ){
      err = attr_len;
      goto out;
    }

    if ( size < attr_len ){
      assert(0);
      err = -ENODATA;
      goto out;
    }

    lock_ufsd( sbi );
    err = ufsd_open_by_id( sbi, i );
    if ( likely( !err ) )
      err = ufsdapi_get_dosattr( sbi->ufsd, u->ufile, &attrib );
    unlock_ufsd( sbi );

    assert(!err);
    if ( err )
      goto out;

    err = attr_len;
    switch( name_len ) {
      case UFSD_XATTR_SYSTEM_DOS_ATTRIB_LEN:
        *(unsigned char*)buffer = attrib;
        goto out;
      case UFSD_XATTR_SYSTEM_NTFS_ATTRIB_LEN:
        *(unsigned int*)buffer = attrib;
        goto out;
      case UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE_LEN:
        *(__be32*)buffer = cpu_to_be32( attrib );
        goto out;
    }

    // Request for user.DOSATTRIB
    attrib &= 0xff;

    //
    // First try to get on-disk xattr
    //
    err = ufsd_getxattr_hlp( i, name, buffer, size, NULL );

    if ( -ENODATA == err || -ENOENT == err ) {
      //
      // Always answer as version 4
      //
      *(__le16*)Add2Ptr( buffer, 0 )    = 0;
      *(__le16*)Add2Ptr( buffer, 2 )    = cpu_to_le16(4);  // version 16 bit
      *(__le32*)Add2Ptr( buffer, 4 )    = cpu_to_le32(4);  // version 32 bit
      *(__le32*)Add2Ptr( buffer, 8 )    = cpu_to_le32(1);  // valid flags (attrib only)
      *(__le32*)Add2Ptr( buffer, 0xc )  = cpu_to_le32(attrib);  // dos attributes
      *(__le64*)Add2Ptr( buffer, 0x10 ) = 0;  // itime
      *(__le64*)Add2Ptr( buffer, 0x18 ) = 0;  // create_time
      DebugTrace( 0, Dbg, ("user.DOSATTRIB=%x", attrib ));
      err = 0x20;
      goto out;
    }

    if ( err < 0 )
      goto out;

    //
    // Update 'attrib' according to real value in place.
    // Try to support version 3 and 4
    //
    o = ALIGN(strnlen( buffer, err ) + 1, 2);

    if ( o + 0xa + 4 >= err
      || ( ver1 = le16_to_cpu(*(__le16 *)Add2Ptr( buffer, o )), ( 3 != ver1 && 4 != ver1 ) )
      || ver1 != le32_to_cpu(*(__le32 *)Add2Ptr( buffer, o + 2 )) ){
      assert(0);
      VfsTrace( 0, UFSD_LEVEL_ERROR, ("Failed to update user.DOSATTRIB actual value\n"));
      goto out;
    }
    *(__le32*)Add2Ptr( buffer, o + 0xa )  = cpu_to_le32(attrib);
    if ( 3 == ver1 )
      snprintf( buffer, o, "0x%x", attrib );
  }
#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
  else if ( ( sizeof( XATTR_NAME_POSIX_ACL_ACCESS ) - 1 == name_len
        && !memcmp( name, XATTR_NAME_POSIX_ACL_ACCESS, sizeof( XATTR_NAME_POSIX_ACL_ACCESS ) ) )
      || ( sizeof( XATTR_NAME_POSIX_ACL_DEFAULT ) - 1 == name_len
        && !memcmp( name, XATTR_NAME_POSIX_ACL_DEFAULT, sizeof( XATTR_NAME_POSIX_ACL_DEFAULT ) ) ) ) {
    err = sbi->options.acl
      ? ufsd_xattr_get_acl( de, sizeof( XATTR_NAME_POSIX_ACL_ACCESS ) - 1 == name_len? ACL_TYPE_ACCESS : ACL_TYPE_DEFAULT, buffer, size )
      : -EOPNOTSUPP;
  }
#endif
  else {
    //
    // Redirect request to ufsd
    //
    err = ufsd_getxattr_hlp( i, name, buffer, size, NULL );
  }

out:
  VfsTrace( -1, UFSD_LEVEL_XATTR, ("getxattr -> %d", err ));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_setxattr
//
// inode_operations::setxattr
///////////////////////////////////////////////////////////
noinline static int
ufsd_setxattr(
    IN const struct xattr_handler *handler,
    IN struct mnt_idmap *idmap,
    IN struct dentry  *de,
    IN struct inode   *i,
    IN const char     *name,
    IN const void     *value,
    IN size_t         size,
    IN int            flags
    )
{
  int err;
  unode *u        = UFSD_U( i );
  usuper *sbi     = UFSD_SB( i->i_sb );
  size_t name_len = strlen( name );
  TRACE_ONLY(char buf[64];)
  TRACE_ONLY( const char *hint = !value && !size && XATTR_REPLACE == flags? "removexattr" : "setxattr" ); // add hint for "replace"

  VfsTrace( +1, UFSD_LEVEL_XATTR, ("%s: %s, \"%s\", %zu, %d", hint, fname( i, buf ), name, size, flags ));

  //
  // Dispatch request
  //
  if ( is_msfs( sbi )
    && ( ( UFSD_XATTR_SYSTEM_DOS_ATTRIB_LEN == name_len
        && !memcmp( name, UFSD_XATTR_SYSTEM_DOS_ATTRIB, UFSD_XATTR_SYSTEM_DOS_ATTRIB_LEN + 1 ) )
      || ( UFSD_XATTR_SYSTEM_NTFS_ATTRIB_LEN == name_len
        && !memcmp( name, UFSD_XATTR_SYSTEM_NTFS_ATTRIB, UFSD_XATTR_SYSTEM_NTFS_ATTRIB_LEN + 1 ) )
      || ( UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE_LEN == name_len
        && !memcmp( name, UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE, UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE_LEN + 1 ) )
      || ( UFSD_XATTR_USER_DOSATTRIB_LEN == name_len
        && !memcmp( current->comm, SAMBA_PROCESS_NAME, SAMBA_PROCESS_NAME_LEN + 1 )
        && !memcmp( name, UFSD_XATTR_USER_DOSATTRIB, UFSD_XATTR_USER_DOSATTRIB_LEN + 1 ) ) ) ) {

    // dos_attrib
    unsigned int attrib = 0, o; // not necessary just to suppress warnings
    __u16 ver1;
    __u32 ver2;

    err = -EINVAL;
    if ( !value )
      goto out;

    switch( name_len ) {
    case UFSD_XATTR_SYSTEM_DOS_ATTRIB_LEN:
      if ( sizeof(unsigned char) != size )
        goto out;
      attrib = *(unsigned char*)value;
      break;
    case UFSD_XATTR_SYSTEM_NTFS_ATTRIB_LEN:
      if ( sizeof(unsigned int) != size )
        goto out;
      attrib = *(unsigned int*)value;
      break;
    case UFSD_XATTR_SYSTEM_NTFS_ATTRIB_BE_LEN:
      if ( sizeof(unsigned int) != size )
        goto out;
      attrib = be32_to_cpu( *(__be32*)value );
      break;
    case UFSD_XATTR_USER_DOSATTRIB_LEN:
      //
      // Try to support version 3 and 4
      //
      o = ALIGN(strnlen( value, size ) + 1, 2); // skip string form of attr (only in version 3)

      assert( o + 0xa + 4 <= size );
      if ( o + 0xa + 4 > size )
        goto out;

      ver1 = le16_to_cpu(*(__le16 *)Add2Ptr( value, o ));
      assert( 3 == ver1 || 4 == ver1 );
      if ( ver1 != 3 && ver1 != 4) {
        VfsTrace( 0, UFSD_LEVEL_ERROR, ("v%d version is not supported\n", ver1 ));
        goto out;
      }

      ver2 = le32_to_cpu(*(__le32 *)Add2Ptr( value, o + 2 ));
      if ( ver1 != ver2 ){
        assert(0);
        VfsTrace( 0, UFSD_LEVEL_ERROR, ("ndr version mismatched %x != %x\n", ver1, ver2 ));
#ifdef UFSD_DEBUG
        ufsd_turn_on_trace_level();
        ufsdapi_dump_memory( value, size );
        ufsd_revert_trace_level();
#endif
        goto out;
      }

      attrib = le32_to_cpu(*(__le32 *)Add2Ptr( value, o + 0xa ));
      DebugTrace( 0, Dbg, ("ndr version %x, attrib=%x\n", ver1, attrib));

      if ( i->i_size <= 1 && ( attrib & UFSDAPI_SYSTEM ) ) {
        // Do not allow to set 'System' attribute if file size is <= 1.
        // If file size == 0 && 'System' attribute is set, then such
        // a file is considered to be FIFO.
        // If file size == 1 && 'System' attribute is set, then such
        // a file is considered to be socket.
        VfsTrace( 0, UFSD_LEVEL_ERROR, ("user.DOSATTRIB: Cannot set 'System' attribute on file with size %llu", i->i_size ));
        goto out;
      }
    }

    lock_ufsd( sbi );
    err = ufsd_open_by_id( sbi, i );
    if ( likely( !err ) )
      err = ufsdapi_set_dosattr( sbi->ufsd, u->ufile, attrib );
    unlock_ufsd( sbi );

    if ( err )
      goto out;

    if ( FlagOn( attrib, UFSDAPI_RDONLY ) )
      i->i_mode &= ~S_IWUGO;
    else
      i->i_mode |= S_IWUGO;

    if ( UFSD_XATTR_USER_DOSATTRIB_LEN != name_len || !is_ntfs( sbi ) )
      goto out;
  }
#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
  else if ( ( sizeof( XATTR_NAME_POSIX_ACL_ACCESS ) - 1 == name_len
        && !memcmp( name, XATTR_NAME_POSIX_ACL_ACCESS, sizeof( XATTR_NAME_POSIX_ACL_ACCESS ) ) )
      || ( sizeof( XATTR_NAME_POSIX_ACL_DEFAULT ) - 1 == name_len
        && !memcmp( name, XATTR_NAME_POSIX_ACL_DEFAULT, sizeof( XATTR_NAME_POSIX_ACL_DEFAULT ) ) ) ) {
    err = sbi->options.acl
      ? ufsd_xattr_set_acl( i, sizeof( XATTR_NAME_POSIX_ACL_ACCESS ) - 1 == name_len? ACL_TYPE_ACCESS : ACL_TYPE_DEFAULT, value, size )
      : -EOPNOTSUPP;
    goto out;
  }
#endif

  //
  // Redirect request to ufsd
  //
  err = ufsd_setxattr_hlp( i, name, value, size, flags, 0 );

  inode_set_ctime_current( i );
  mark_inode_dirty( i );

out:
  VfsTrace( -1, UFSD_LEVEL_XATTR, ("%s -> %d", hint, err ));
  return err;
}

#ifdef UFSD_USE_XATTR

///////////////////////////////////////////////////////////
// ufsd_listxattr
//
// inode_operations::listxattr
//
// Copy a list of attribute names into the buffer
// provided, or compute the buffer size required.
// buffer is NULL to compute the size of the buffer required.
//
// Returns a negative error number on failure, or the number of bytes
// used / required on success.
///////////////////////////////////////////////////////////
static ssize_t
ufsd_listxattr(
    IN  struct dentry *de,
    OUT char          *buffer,
    IN  size_t        size
    )
{
  struct inode *i = de->d_inode;
  unode *u        = UFSD_U( i );
  usuper *sbi     = UFSD_SB( i->i_sb );
  ssize_t ret;
  int err;
  TRACE_ONLY(char buf[64];)

  VfsTrace( +1, UFSD_LEVEL_XATTR, ("listxattr: %s, %pK, %zu, flags = %lx", fname( i, buf ), buffer, size, u->flags ));

  lock_ufsd( sbi );

  err = ufsd_open_by_id( sbi, i );
  if ( likely( !err ) )
    err = ufsdapi_list_xattr( sbi->ufsd, u->ufile, buffer, size, (size_t*)&ret );
  if ( err )
    ret = err;

  unlock_ufsd( sbi );

  VfsTrace( -1, UFSD_LEVEL_XATTR, ("listxattr -> %zd", ret ));
  return ret;
}
#endif // #ifdef UFSD_USE_XATTR


///////////////////////////////////////////////////////////
// ufsd_lookup
//
// inode_operations::lookup
//
//  This routine is a callback used to load inode for a
//  direntry when this direntry was not found in dcache.
//
// dir - container inode for this operation.
//
// dentry - On entry contains name of the entry to find.
//          On exit should contain inode loaded.
//
// Return:
// struct dentry* - direntry in case of one differs from one
//     passed to me. I return NULL to indicate original direntry has been used.
//     ERRP() can also be returned to indicate error condition.
//
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_lookup(
    IN struct inode  *dir,
    IN struct dentry *de,
    IN unsigned int nd
    )
{
  struct inode *i = ufsd_create_or_open( dir, de, NULL );

  if ( IS_ERR( i ) ) {
    if ( -ENOENT == PTR_ERR( i ) )
      i = NULL;
    else
      return (struct dentry*)i;
  }

  if ( i && UFSD_SB( dir->i_sb )->options.use_dop ) {
    struct dentry *a = d_find_alias( i );
    if ( a && a->d_parent == de->d_parent && !(IS_ROOT(de) && (de->d_flags & DCACHE_DISCONNECTED))) {
      if (d_unhashed(a)) {
        assert( 0 ); // to debug
        DebugTrace( 0, Dbg, ("ufsd_lookup: d_flags %x ; a->d_name \"%.*s\" ; de->d_name \"%.*s\"",
                          a->d_flags, a->d_name.len, a->d_name.name, de->d_name.len, de->d_name.name));
        d_drop(de);
        d_rehash(a);
      } else if (!S_ISDIR(i->i_mode)) {
        d_move(a, de);
      }
      iput(i);
      return a;
    }
    dput(a);
  }

  return d_splice_alias( i, de );
}

static int
ufsd_symlink(
    IN struct mnt_idmap *idmap,
    IN struct inode   *dir,
    IN struct dentry  *de,
    IN const char     *symname
    );

static int
ufsd_mknod(
    IN struct mnt_idmap *idmap,
    IN struct inode   *dir,
    IN struct dentry  *de,
    IN umode_t        mode,
    IN dev_t          rdev
    );


#ifdef UFSD_USE_LINK
///////////////////////////////////////////////////////////
// ufsd_link
//
// This function creates a hard link
// inode_operations::link
///////////////////////////////////////////////////////////
static int
ufsd_link(
    IN struct dentry  *ode,
    IN struct inode   *dir,
    OUT struct dentry *de
    )
{
  int err;
  struct inode *i;
  struct inode *oi = ode->d_inode;
  ucreate  cr = { (ufsd_file*)oi };
  usuper *sbi = UFSD_SB( dir->i_sb );
  UNREFERENCED_PARAMETER( sbi );

  assert( UFSD_FH(dir) );
  assert( S_ISDIR( dir->i_mode ) );
  assert( dir->i_sb == oi->i_sb );

  if ( !is_ntfs( sbi ) && !is_hfs( sbi ) && !is_apfs( sbi ) && !is_xfs( sbi ) && !is_refs3( sbi ) )
    return -EPERM;

  VfsTrace( +1, Dbg, ("link: r=%lx, \"%.*s\" -> r=%lx, /\"%.*s\"",
                        oi->i_ino, (int)ode->d_name.len, ode->d_name.name,
                        dir->i_ino, (int)de->d_name.len, de->d_name.name ));

  if ( IS_ERR( i = ufsd_create_or_open( dir, de, &cr ) ) ) {
    err = PTR_ERR( i );
  } else {
    err = 0;
    //
    // Hard link is created
    //
    assert( i == oi );
    d_instantiate( de, i );
    inc_nlink( i );
  }

  VfsTrace( -1, Dbg, ("link -> %d", err ));

  return err;
}
#endif


#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
///////////////////////////////////////////////////////////
// ufsd_get_acl
//
// inode_operations::get_acl
// inode lock (inode->i_mutex / inode->i_rwsem): don't care
///////////////////////////////////////////////////////////
static struct posix_acl*
ufsd_get_acl(
    IN struct mnt_idmap *idmap,
    IN struct dentry* de,
    IN int          type
    )
{
  return ufsd_get_acl_ex( de->d_inode, type, 0 );
}
#else
#define ufsd_get_acl NULL
#endif

#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
///////////////////////////////////////////////////////////
// ufsd_set_acl
//
// inode_operations::set_acl
///////////////////////////////////////////////////////////
static int
ufsd_set_acl(
    IN struct mnt_idmap *idmap,
    IN struct dentry    *de,
    IN struct posix_acl *acl,
    IN int              type
    )
{
  return ufsd_set_acl_ex( de->d_inode, acl, type, 0, false );
}
#else
#define ufsd_set_acl NULL
#endif


static const struct inode_operations ufsd_dir_inode_operations = {
  .getattr      = ufsd_getattr,
  .lookup       = ufsd_lookup,
  .create       = ufsd_create,
#ifdef UFSD_USE_LINK
  .link         = ufsd_link,
#endif
  .unlink       = ufsd_unlink,
  .symlink      = ufsd_symlink,
  .mkdir        = ufsd_mkdir,
  .rmdir        = ufsd_unlink,
  .mknod        = ufsd_mknod,
  .rename       = ufsd_rename,
  .setattr      = ufsd_setattr,
#ifdef UFSD_USE_XATTR
  .listxattr    = ufsd_listxattr,
#endif
#ifdef CONFIG_FS_POSIX_ACL
  .permission   = ufsd_permission,
  .get_acl      = ufsd_get_acl,
  .set_acl      = ufsd_set_acl,
#endif
  .fiemap       = ufsd_fiemap,
  .fileattr_get = ufsd_fileattr_get,
  .fileattr_set = ufsd_fileattr_set,
};


static bool
ufsd_xattr_user_list(struct dentry *dentry)
{
  return 1;
}


static const struct xattr_handler ufsd_xattr_handler = {
  .prefix = "",
  .get    = ufsd_getxattr,
  .set    = ufsd_setxattr,
  .list   = ufsd_xattr_user_list,
};

static const struct xattr_handler * const ufsd_xattr_handlers[] = {
  &ufsd_xattr_handler,
  NULL
};

static const struct inode_operations ufsd_special_inode_operations = {
  .getattr      = ufsd_getattr,
  .setattr      = ufsd_setattr,
#ifdef UFSD_USE_XATTR
  .listxattr    = ufsd_listxattr,
#ifdef CONFIG_FS_POSIX_ACL
  .permission   = ufsd_permission,
  .get_acl      = ufsd_get_acl,
  .set_acl      = ufsd_set_acl,
#endif
#endif
};


///////////////////////////////////////////////////////////
// ufsd_mknod
//
//
///////////////////////////////////////////////////////////
static int
ufsd_mknod(
    IN struct mnt_idmap *idmap,
    IN struct inode   *dir,
    IN struct dentry  *de,
    IN umode_t        mode,
    IN dev_t          rdev
    )
{
  struct inode *i;
  int     err;
  unsigned int udev32 = new_encode_dev( rdev );
  ucreate  cr = { NULL, &udev32, sizeof(udev32), 0, 0, mode };

  VfsTrace( +1, Dbg, ("mknod m=%o, %x", mode, udev32));

  if ( IS_ERR( i = ufsd_create_or_open( dir, de, &cr ) ) )
    err = PTR_ERR( i );
  else {
    err = 0;
    init_special_inode( i, i->i_mode, rdev );
    i->i_op = &ufsd_special_inode_operations;
    mark_inode_dirty( i );
    d_instantiate( de, i );
  }

  VfsTrace( -1, Dbg, ("mknod -> %d", err));

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_extend_initialized_size
//
// helper function 'i->i_mutex' / 'i->i_rwsem' is locked
///////////////////////////////////////////////////////////
static int
ufsd_extend_initialized_size(
    IN struct file    *file,
    IN unode          *u,
    IN const loff_t   valid,
    IN const loff_t   new_valid,
    IN int            force
    )
{
  int err;
  loff_t i_size = u->i.i_size;
  loff_t pos    = valid;
  struct address_space *mapping = u->i.i_mapping;
  const struct address_space_operations *ops = mapping->a_ops;
  usuper *sbi = UFSD_SB( u->i.i_sb );
  mapinfo map;

  assert( !is_compressed( u ) );
  assert( inode_is_locked( &u->i ) );

  DebugTrace( +1, Dbg, ("zero(r=%lx,): [%llx-%llx,%llx]", u->i.i_ino, valid, new_valid, i_size ));

  BUG_ON( valid >= new_valid );

  for ( ;; ) {
    unsigned zerofrom, len;
    void *fsdata;

    if ( is_sparsed( u ) && !force ) {
      loff_t pos2 = pos & sbi->cluster_mask_inv;
      err = vbo_to_lbo( sbi, u, pos2, 0, &map );
      if ( err )
        goto error;

      if ( UFSD_VBO_LBO_HOLE == map.lbo && 0 != map.len ) {
        loff_t to = pos2 + map.len;
        if ( to <= new_valid ) {
//          DebugTrace( 0, Dbg, ("zero(r=%lx), skip sparse cluster(s) at [%llx + %llx)", u->i.i_ino, pos2, map.len ));
          set_valid_size( u, to );
          pos = to;
          goto next;
        }

        if ( pos2 < pos ) {
//          DebugTrace( 0, Dbg, ("zero(r=%lx), zero head of sparse cluster at %llx", u->i.i_ino, pos2 ));
          pos = pos2;
        } else {
          to = new_valid & sbi->cluster_mask_inv;
          if ( pos < to ) {
            set_valid_size( u, to );
//            DebugTrace( 0, Dbg, ("zero(r=%lx), skip sparse clusters at [%llx + %llx)", u->i.i_ino, pos2, (UINT64)(to - pos2) ));
            pos = to;
            goto next;
          }
        }
      }
    }

    zerofrom = pos & (PAGE_SIZE-1);
    len      = PAGE_SIZE - zerofrom;

    if ( pos + len > new_valid )
      len = new_valid - pos;

    {
#if is_decl( WRITE_BEGIN_V2 )
      struct folio* folio;
//    DebugTrace( 0, Dbg, ("pagecache_zero(r=%lx): [%llx + %x)", u->i.i_ino, pos, len ));
      err = ops->write_begin( file, mapping, pos, len, &folio, &fsdata );
      if ( err )
        goto error;
      zero_user_segment( &folio->page, zerofrom, PAGE_SIZE );
      err = ops->write_end( file, mapping, pos, len, len, folio, fsdata );
#else
      struct page *page;
//    DebugTrace( 0, Dbg, ("pagecache_zero(r=%lx): [%llx + %x)", u->i.i_ino, pos, len ));
      err = ops->write_begin( file, mapping, pos, len, &page, &fsdata );
      if ( err )
        goto error;
      zero_user_segment( page, zerofrom, PAGE_SIZE );
      err = ops->write_end( file, mapping, pos, len, len, page, fsdata );
#endif
    }
    if ( err < 0 )
      goto error;

    BUG_ON( err != len );

    pos += len;
next:
    if ( pos >= new_valid )
      break;

    balance_dirty_pages_ratelimited( mapping );
  }

  assert( new_valid == u->valid );
  mark_inode_dirty( &u->i );
  DebugTrace( -1, Dbg, ("zero(r=%lx,) -> sz=%llx,%llx", u->i.i_ino, u->valid, u->i.i_size ));

  return 0;

error:
  set_valid_size( u, valid );
  DebugTrace( -1, Dbg, ("zero(r=%lx,) -> error %d, [%llx-%llx,%llx]", u->i.i_ino, err, valid, new_valid, i_size ));
  ufsd_printk( u->i.i_sb, "failed to extend initialized size of inode 0x%lx (error %d), [%llx-%llx,%llx].", u->i.i_ino, err, valid, new_valid, i_size );
  return err;
}


#if defined UFSD_USE_STREAM
///////////////////////////////////////////////////////////
// ufsd_file_io:
//
// Helper function to write/read ntfs streams or deduped files
///////////////////////////////////////////////////////////
noinline static ssize_t
ufsd_file_io(
    IN OUT struct kiocb     *iocb,
    IN struct iov_iter      *iter,
    IN const unsigned char  *p,
    IN loff_t                pos,
    IN unsigned char         op // READ/WRITE == iov_iter_rw( iter )
    )
{
  struct file  *file    = iocb->ki_filp;
  struct inode *i       = file_inode( file );
  unode        *u       = UFSD_U( i );
  usuper       *sbi     = UFSD_SB( i->i_sb );
  struct qstr  *s       = &file_dentry(file)->d_name;
  int           nlen    = p? (s->name + s->len - p) : 0;
  ssize_t       err     = 0;
  loff_t        pos0    = pos;
  size_t        count   = iov_iter_count( iter );
  void       *rw_buffer = sbi->rw_buffer;
  size_t done, rdwr;

  DEBUG_ONLY( const char *hint = READ == op? "read":"write"; )

  if ( 0 == count )
    return 0;

  DebugTrace( +1, Dbg, ("file_io_%s: r=%lx, (:%.*s), %llx, %zx", hint, u->i.i_ino, nlen, p, pos, count ));

  if ( unlikely( FlagOn( iocb->ki_flags, IOCB_DIRECT ) ) ) {
    DebugTrace( -1, Dbg, ("direct I/O for streams is not supported" ));
    return -EOPNOTSUPP;
  }

  //
  // Operate via sbi->rw_buffer
  //
  lock_ufsd( sbi );

  assert( rw_buffer );

  if ( READ == op ){
    for( ; ; ) {
      err = ufsdapi_file_read( sbi->ufsd, u->ufile, p, nlen, pos, min_t( size_t, RW_BUFFER_SIZE, count ), rw_buffer, &rdwr );
      assert(!err);
      if ( err )
        break;

      if ( 0 == rdwr ){
        //iov_iter_zero( count, iter );
        break;
      }

      done = copy_to_iter( rw_buffer, rdwr, iter );
      assert( done == rdwr );
      pos += done;
      if ( done >= count )
        break;
      count -= done;
    }
  } else {
    if ( -1 == pos ){
      // append, get stream size
      pos = pos0 = ufsdapi_getsize_ads( sbi->ufsd, u->ufile, p, nlen );
    }
    for( ;; ) {
      done = copy_from_iter( rw_buffer, min_t( size_t, RW_BUFFER_SIZE, count ), iter );
      if ( !done )
        break;

      err = ufsdapi_file_write( sbi->ufsd, u->ufile, p, nlen, pos, done, rw_buffer, &rdwr, NULL );
      assert(!err);
      if ( err )
        break;
      if ( rdwr != done ){
        err = -EIO;     // ??
        break;
      }
      pos += done;
      if ( done >= count )
        break;
      count -= done;
    }
  }

  unlock_ufsd( sbi );

  // Update file position
  iocb->ki_pos = pos;

  if ( !err )
    err = pos - pos0;

  DebugTrace( -1, Dbg, ("file_io_%s -> %zx", hint, err ));
  return err;
}
#endif

#if defined UFSD_USE_STREAM || defined UFSD_TRACE
///////////////////////////////////////////////////////////
// ufsd_file_read_iter:  3.16+
//
// based on: mm/filemap.c: generic_file_read_iter
// file_operations::read_iter
///////////////////////////////////////////////////////////
static ssize_t
ufsd_file_read_iter(
    IN struct kiocb     *iocb,
    IN struct iov_iter  *iter
    )
{
  ssize_t err;
  struct file  *file = iocb->ki_filp;
  struct inode *i    = file_inode( file );
  unode        *u    = UFSD_U( i );
  size_t       count = iov_iter_count( iter );
  TRACE_ONLY(char buf[64];)

  if ( unlikely(ufsd_forced_shutdown( UFSD_SB( i->i_sb ) ) ) )
    return -EIO;

  if ( unlikely( is_encrypted( u ) ) ) {
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("file_read: %s, attempt to read encrypted file", fname( i, buf ) ));
    return -ENOSYS;
  }

  VfsTrace( +1, Dbg, ("file_read: %s, [%llx + %zx), sz=%llx,%llx%s, it=%d",
                       fname( i, buf ), iocb->ki_pos, count, u->valid, i->i_size,
                       FlagOn( iocb->ki_flags, IOCB_DIRECT )? ",di":"", (int)iov_iter_type(iter) ));

  if ( !count )
    err = 0; // skip atime
  else{
#ifdef UFSD_USE_STREAM
    const unsigned char *p = is_stream( file );
    if ( unlikely( p ) || is_dedup(u) ) {
      err = ufsd_file_io( iocb, iter, p, iocb->ki_pos, READ );
    } else
#endif
      err = generic_file_read_iter( iocb, iter );
  }

  VfsTrace( -1, Dbg, (err > 0 ? "file_read(r=%lx) -> %zx" : "file_read(r=%lx) -> %zd", i->i_ino, err));

  return err;
}
#else
  #define ufsd_file_read_iter generic_file_read_iter
#endif


///////////////////////////////////////////////////////////
// ufsd_file_write_iter:
//
// based on: mm/filemap.c: generic_file_write_iter
// file_operations::write_iter
///////////////////////////////////////////////////////////
static ssize_t
ufsd_file_write_iter(
    IN struct kiocb     *iocb,
    IN struct iov_iter  *iter
    )
{
  ssize_t ret;
  loff_t  end, i_size;
  int dirty                     = 0;
  struct file  *file            = iocb->ki_filp;
  struct address_space *mapping = file->f_mapping;
  struct inode *i               = mapping->host;
  struct super_block  *sb       = i->i_sb;
  usuper  *sbi                  = UFSD_SB( sb );
  unode *u                      = UFSD_U( i );
  loff_t  pos                   = iocb->ki_pos;
  size_t count                  = iov_iter_count( iter );
  TRACE_ONLY(char buf[64];)

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  if ( unlikely( is_encrypted( u ) ) ) {
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("file_write: %s, attempt to write to encrypted file", fname( i, buf ) ));
    return -ENOSYS;
  }

  if (!inode_trylock(i)) {
    if (iocb->ki_flags & IOCB_NOWAIT)
      return -EAGAIN;
    inode_lock(i);
  }

  VfsTrace( +1, Dbg, ("file_write: %s, [%llx + %zx), sz=%llx,%llx%s%s",
                        fname( i, buf ), pos, count, u->valid, i->i_size,
                        FlagOn( iocb->ki_flags, IOCB_APPEND )? ",append":"",
                        FlagOn( iocb->ki_flags, IOCB_DIRECT )? ",di":"" ));

  ret = generic_write_checks( iocb, iter );
  if ( unlikely( ret <= 0 ) )
    goto out;

  pos   = iocb->ki_pos;
  count = ret;

#ifdef UFSD_USE_STREAM
  {
    const unsigned char *p = is_stream( file );
    if ( unlikely( p ) ) {
      ret = ufsd_file_io( iocb, iter, p,
                          FlagOn( iocb->ki_flags, IOCB_APPEND )? -1 : iocb->ki_pos,
                          WRITE );
      goto out;
    }
  }
#endif

  i_size  = i->i_size;
  end     = pos + count;

  if ( likely( end > i_size ) ) {

    if ( end > ( is_sparsed_or_compressed( u )? sbi->maxbytes_sparse : sbi->maxbytes ) ) {
      ret = -EFBIG;
      goto out;
    }

    if ( is_compressed( u ) ) {
      ret = ufsd_set_size_ufsd( i, i_size, end );
      if ( unlikely( ret ) )
        goto out;
    } else {
      mapinfo map;
      loff_t vbo;
      for ( vbo = pos; vbo < end; vbo += map.len ) {
        ret = vbo_to_lbo( sbi, u, vbo, end - vbo, &map );
        if ( unlikely( ret ) )
          goto out;

#ifdef UFSD_USE_SPARSE
        if ( is_sparsed( u ) && FlagOn( map.flags, UFSD_MAP_LBO_NEW ) ) {
          loff_t endm = vbo + map.len;
          ufsd_sparse_cluster( i, NULL, vbo, 0 );
          if ( endm > end )
            ufsd_sparse_cluster( i, NULL, end, endm - end );
        }
#endif
      }
    }
    dirty = 1;
  }

  if ( !is_compressed( u ) ) {
    loff_t valid = get_valid_size( u, NULL, NULL );
    if ( unlikely( pos > valid ) ) {
      ret = ufsd_extend_initialized_size( file, u, valid, pos, false );
      if ( unlikely( ret < 0 ) )
        goto out;
      dirty = 1;
    }
  }

  if ( dirty )
    mark_inode_dirty_sync( i );

  ret = __generic_file_write_iter( iocb, iter );

out:
  inode_unlock( i );

  if ( likely( ret > 0 ) )
    ret = ufsd_write_sync( iocb, ret );

  if ( likely( ret > 0 ) ) {
    if ( unlikely( sbi->options.wb && ret >= PAGE_SIZE ) ) {
      if ( atomic_dec_and_test( &sbi->writeiter_cnt ) ) {
        try_to_writeback_inodes_sb( sb, WB_REASON_SYNC );
        atomic_set( &sbi->writeiter_cnt, sbi->options.wb );
      }
    } else if ( unlikely ( sbi->options.wbMb_in_pages ) ) {
      // Check if the number of pages exceeds the limit
      unsigned dirty_pages_count = atomic_read( &sbi->dirty_pages_count );
      if ( dirty_pages_count >= sbi->options.wbMb_in_pages ) {
        // Need this debug print for test_wbxm_option
        DebugTrace( 0, Dbg, ( "Call to Try_to_writeback_inodes_sb (%x)", dirty_pages_count ) );
        try_to_writeback_inodes_sb( sb, WB_REASON_SYNC );
      }
    }
  }

  VfsTrace( -1, Dbg, (ret > 0? "file_write(r=%lx,) -> %zx" : "file_write(r=%lx) -> %zd", i->i_ino, ret ));

  return ret;
}

///////////////////////////////////////////////////////////
// ufsd_file_map_close
//
// xfstest/generic/030
// Fix mapped writes against remap+truncate down/up.
// mmap + truncate + unmap
//
// vm_operations_struct::close
///////////////////////////////////////////////////////////
static void
ufsd_file_map_close(
    IN struct vm_area_struct * vma
    )
{
  struct inode *i   = file_inode( vma->vm_file );
  unode *u          = UFSD_U( i );
  UINT64 from       = ((UINT64)vma->vm_pgoff << PAGE_SHIFT);
  UINT64 to         = from + vma->vm_end - vma->vm_start;
  unsigned long flags;
  bool dirty = false;

  // update valid size
  write_lock_irqsave( &u->rwlock, flags );
  if ( to > u->valid ){
//    ufsd_printk( i->i_sb, "r=%lx, **** %llx -> %llx.", i->i_ino, u->valid, to );
    u->valid = to;
    dirty = true;
  }
  write_unlock_irqrestore( &u->rwlock, flags );

  if ( dirty )
    mark_inode_dirty( i );

  vma->vm_ops = NULL;
}

static struct vm_operations_struct ufsd_vm_ops;

///////////////////////////////////////////////////////////
// ufsd_file_mmap
//
// file_operations::mmap
///////////////////////////////////////////////////////////
static int
ufsd_file_mmap(
    IN struct file                *file,
    IN OUT struct vm_area_struct  *vma
    )
{
  int err;
  struct inode *i = file_inode( file );
  unode *u        = UFSD_U( i );
  UINT64 from     = ((UINT64)vma->vm_pgoff << PAGE_SHIFT);
  UINT64 to       = from + vma->vm_end - vma->vm_start;
  int rw          = vma->vm_flags & VM_WRITE;

  if ( unlikely(ufsd_forced_shutdown( UFSD_SB( i->i_sb ) ) ) )
    return -EIO;

  assert( from <= i->i_size );

  VfsTrace( +1, Dbg, ("file_mmap: r=%lx, %lx(%s%s), [%llx + %lx), s=%llx,%llx",
              i->i_ino, vma->vm_flags,
              (vma->vm_flags & VM_READ)?"r":"",
              rw?"w":"",
              from, vma->vm_end - vma->vm_start, u->valid, i->i_size ));

  if ( unlikely( is_stream( file ) || is_encrypted( u ) ) ) {
    err = -EOPNOTSUPP; // no mmap for streams and encrypted files
    goto out;
  }

  if ( rw ) {
    loff_t i_size;
    int locked;
    UINT64 valid = get_valid_size( u, &i_size, NULL );

    if ( to > i_size )
      to = i_size;
    err = 0;

    locked = is_sparsed( u ) || valid < to;
    if ( locked )
      inode_lock( i );

    if ( is_sparsed( u ) ) {
      //
      // fallocate clusters
      //
      mapinfo map;
      do {
        err = vbo_to_lbo( UFSD_SB( i->i_sb ), u, from, to - from, &map );
#ifdef UFSD_USE_SPARSE
        if ( !err && FlagOn( map.flags, UFSD_MAP_LBO_NEW ) ) {
          ufsd_sparse_cluster( i, NULL, from, map.len );
        }
#endif
        from += map.len;
      } while ( !err && from < to );
    }

    if ( !is_compressed( u ) && valid < to && !err )
      err = ufsd_extend_initialized_size( file, u, valid, to, true );

    if ( locked )
      inode_unlock( i );
    if ( unlikely( err ) )
      goto out;
  }

  //
  // Call generic function
  //
  err = generic_file_mmap( file, vma );

  if ( !err && !vma->vm_ops->close && rw ) {
    if ( !ufsd_vm_ops.close ) {
      memcpy( &ufsd_vm_ops, vma->vm_ops, sizeof(struct vm_operations_struct) );
      ufsd_vm_ops.close = ufsd_file_map_close;
    }
    vma->vm_ops = &ufsd_vm_ops;
  }

out:
  VfsTrace( -1, Dbg, ("file_mmap -> %d", err) );

  return err;
}


#if defined UFSD_TRACE || defined UFSD_USE_STREAM
///////////////////////////////////////////////////////////
// ufsd_file_splice_read
//
// file_operations::splice_read
///////////////////////////////////////////////////////////
static ssize_t
ufsd_file_splice_read(
    IN struct file  *file,
    IN OUT loff_t   *ppos,
    IN struct pipe_inode_info *pipe,
    IN size_t       len,
    IN unsigned int flags
    )
{
  ssize_t ret;
  struct inode* i = file_inode( file );

  if ( unlikely( ufsd_forced_shutdown( UFSD_SB( i->i_sb ) ) ) )
    return -EIO;

  VfsTrace( +1, Dbg, ("splice_read: r=%lx, %llx %zx", i->i_ino, *ppos, len ));

  ret = is_stream( file )? -ENOSYS : filemap_splice_read( file, ppos, pipe, len, flags );

  VfsTrace( -1, Dbg, ("splice_read -> %zx", ret));

  return ret;
}
#else
  #define ufsd_file_splice_read filemap_splice_read
#endif


#if defined UFSD_TRACE || defined UFSD_USE_STREAM
///////////////////////////////////////////////////////////
// ufsd_file_splice_write
//
// file_operations::splice_write
///////////////////////////////////////////////////////////
static ssize_t
ufsd_file_splice_write(
    IN struct pipe_inode_info *pipe,
    IN struct file  *file,
    IN OUT loff_t   *ppos,
    IN size_t       len,
    IN unsigned int flags
    )
{
  ssize_t ret;

  VfsTrace( +1, Dbg, ("splice_write: r=%lx, %llx %zx", file_inode( file )->i_ino, *ppos, len ));

  ret = is_stream( file )? -ENOSYS : iter_file_splice_write( pipe, file, ppos, len, flags );

  VfsTrace( -1, Dbg, ("splice_write -> %zx", ret));

  return ret;
}
#else
#define ufsd_file_splice_write  iter_file_splice_write
#endif


#include <linux/falloc.h>
///////////////////////////////////////////////////////////
// ufsd_fallocate
//
// inode_operations::fallocate
///////////////////////////////////////////////////////////
static long
ufsd_fallocate(
    IN struct file  *file,
    IN int    mode,
    IN loff_t vbo,
    IN loff_t len
    )
{
  int err;
  struct inode *i = file_inode( file );
  struct super_block *sb = i->i_sb;
  usuper *sbi = UFSD_SB( sb );
  unode *u    = UFSD_U( i );
  UINT64 new_size, new_alloc, new_valid;
  loff_t to = vbo + len;
  unsigned long flags;
  loff_t i_size;
  loff_t vbo_down = round_down( vbo, PAGE_SIZE );
  TRACE_ONLY(char buf[64];)

  C_ASSERT( 0x10 == FALLOC_FL_ZERO_RANGE );

  UNREFERENCED_PARAMETER( to );

  VfsTrace( +1, Dbg, ("fallocate: %s, [%llx + %llx), sz=%llx,%llx, mode=%x",
      fname( i, buf ), vbo, len, u->valid, i->i_size, mode ));

  if ( !S_ISREG( i->i_mode ) ) {
    err = -EOPNOTSUPP;
    goto out;
  }

  inode_lock( i );
  i_size  =  i_size_read( i );
  new_size = max(to, i_size);

  //
  // Check possible size
  //
  err = inode_newsize_ok( i, new_size );
  if ( err )
    goto inode_unlock;

  if ( (FALLOC_FL_PUNCH_HOLE | FALLOC_FL_KEEP_SIZE) == mode ) {
    C_ASSERT( 0x02 == FALLOC_FL_PUNCH_HOLE );

    if ( (vbo | to) & (sb->s_blocksize - 1) ) {
      // TODO: add support
      err = -EOPNOTSUPP;
      goto inode_unlock;
    }

    err = filemap_write_and_wait_range( i->i_mapping, vbo, to - 1 );
    if ( err )
      goto inode_unlock;

    err = filemap_write_and_wait_range( i->i_mapping, to, LLONG_MAX );
    if ( err )
      goto inode_unlock;

    truncate_pagecache( i, vbo_down );
  } else if ( FALLOC_FL_COLLAPSE_RANGE == mode ) {
    C_ASSERT( 0x08 == FALLOC_FL_COLLAPSE_RANGE );

    //
    // Write tail of the last page before removed range since it will get
    // removed from the page cache below.
    //
    err = filemap_write_and_wait_range( i->i_mapping, vbo_down, vbo );
    if ( err )
      goto inode_unlock;

    //
    // Write data that will be shifted to preserve them when discarding page cache below
    //
    err = filemap_write_and_wait_range( i->i_mapping, to, LLONG_MAX );
    if ( err )
      goto inode_unlock;

    truncate_pagecache( i, vbo_down );
  } else if ( FALLOC_FL_INSERT_RANGE == mode ) {
    C_ASSERT( 0x20 == FALLOC_FL_INSERT_RANGE );

    // Write out all dirty pages
    err = filemap_write_and_wait_range( i->i_mapping, vbo_down, LLONG_MAX );
    if ( err )
      goto inode_unlock;
    truncate_pagecache( i, vbo_down );
  } else if ( 0 == mode ){
    if ( u->valid < to && !is_compressed(u) ){
#if 0
      // torrent applications use fallocate(0) to allocate space and then random write into file
      // activate this branch to avoid unnecessary zeroing
      u->valid = to;
#else
      err = ufsd_extend_initialized_size( file, u, u->valid, to, true );
      assert(!err);
      if ( err )
        goto inode_unlock;
#endif
    }
  }

  lock_ufsd( sbi );

  // sync ufsd and vfs sizes
  err = ufsdapi_file_flush( sbi->ufsd, u->ufile, sbi->fi, ufsd_update_ondisk( sbi, i, sbi->fi ),
                            i, 1, 0, &new_alloc );
  if ( err )
    goto unlock;

  if ( !is_compressed( u ) )
    update_cached_size( sbi, u, i_size, &new_alloc );

  //
  // Call UFSD library
  //
  err = ufsdapi_file_fallocate( u->ufile, vbo, len, mode, &new_size, &new_valid, &new_alloc );
  if ( err )
    goto unlock;

  write_lock_irqsave( &u->rwlock, flags );
  u->len   = 0;
  u->valid = new_valid;
  inode_set_bytes( &u->i, new_alloc );
  write_unlock_irqrestore( &u->rwlock, flags );

  i_size_write( i, new_size );

unlock:
  unlock_ufsd( sbi );

inode_unlock:
  if ( !err ){
    err = file_modified( file );
    assert(!err);
  }

  inode_unlock( i );

out:
  VfsTrace( -1, Dbg, ("fallocate -> %d, sz=%llx,%llx", err, u->valid, i->i_size ));

  return err;
}

static const struct file_operations ufsd_file_ops = {
  .llseek         = generic_file_llseek,
  .read_iter      = ufsd_file_read_iter,
  .write_iter     = ufsd_file_write_iter,
  .unlocked_ioctl = ufsd_ioctl,
  .compat_ioctl   = compat_ptr_ioctl,
  .mmap           = ufsd_file_mmap,
  .open           = ufsd_file_open,
  .release        = ufsd_file_release,
  .fsync          = ufsd_file_fsync,
  .splice_write   = ufsd_file_splice_write,
  .splice_read    = ufsd_file_splice_read,
  .fallocate      = ufsd_fallocate,
};


static const struct inode_operations ufsd_file_inode_ops = {
  .setattr      = ufsd_setattr,
  .getattr      = ufsd_getattr,
#ifdef UFSD_USE_XATTR
  .listxattr    = ufsd_listxattr,
#ifdef CONFIG_FS_POSIX_ACL
  .permission   = ufsd_permission,
  .get_acl      = ufsd_get_acl,
  .set_acl      = ufsd_set_acl,
#endif
#endif
  .fiemap       = ufsd_fiemap,
  .fileattr_get = ufsd_fileattr_get,
  .fileattr_set = ufsd_fileattr_set,
};


#ifdef UFSD_HFS_ONLY
#define ufsd_put_link page_put_link
#define ufsd_follow_link page_follow_link_light
#define ufsd_get_link page_get_link
#else

///////////////////////////////////////////////////////////
// ufsd_get_link 4.5+
//
// inode_operations::get_link
///////////////////////////////////////////////////////////
static const char*
ufsd_get_link(
    IN struct dentry  *de,
    IN struct inode   *i,
    IN struct delayed_call *done
    )
{
  char *ret;
  int err;
  usuper *sbi = UFSD_SB( i->i_sb );

  if ( !de )
    return ERR_PTR( -ECHILD );

  VfsTrace( +1, Dbg, ("get_link: r=%lx, '%.*s'", i->i_ino, (int)de->d_name.len, de->d_name.name ));

  if ( is_hfs( sbi ) ){
    ret = (char*)page_get_link( de, i, done );
    goto out;
  }

  ret = kmalloc( PAGE_SIZE, GFP_NOFS );
  if ( !ret ){
    ret = ERR_PTR( -ENOMEM );
    goto out;
  }

  //
  // Call library code to read link
  //
  lock_ufsd( sbi );

  err = ufsdapi_read_link( UFSD_U(i)->ufile, ret, PAGE_SIZE );

  unlock_ufsd( sbi );

  if ( err ){
    ret = ERR_PTR(-EFAULT);
    goto out;
  }

  // always set last zero.
//  nd_terminate_link( ret, PAGE_SIZE - 1 );
  ret[PAGE_SIZE - 1] = '\0';
  set_delayed_call( done, kfree_link, ret );

out:
  VfsTrace( -1, Dbg, ("get_link -> %pK", ret ));

  return ret;
}
#endif

static const struct inode_operations ufsd_link_inode_operations_ufsd = {
  .getattr      = ufsd_getattr,
  .get_link     = ufsd_get_link,
  .setattr      = ufsd_setattr,
#ifdef UFSD_USE_XATTR
  .listxattr    = ufsd_listxattr,
#endif
};


typedef struct upage_data {
  loff_t      next_lbo;
  struct bio *bio;
} upage_data;


///////////////////////////////////////////////////////////
// ufsd_end_buffer_async_read
//
// this function comes from fs/buffer.c 'end_buffer_async_read'
///////////////////////////////////////////////////////////
static void
ufsd_end_buffer_async_read(
    IN struct buffer_head *bh,
    IN int uptodate
    )
{
  unsigned long flags;
  struct buffer_head  *tmp;
  int page_uptodate = 1;
  struct page *page = bh->b_page;
  struct buffer_head  *first = page_buffers( page );
  struct inode *i   = page->mapping->host;

  if ( likely( uptodate ) ) {
    unode *u           = UFSD_U( i );
    unsigned bh_off    = bh_offset( bh );
    loff_t buffer_off  = bh_off + ((loff_t)page->index << PAGE_SHIFT);
    loff_t i_size, valid = get_valid_size( u, &i_size, NULL );
    if ( valid > i_size )
      valid = i_size;

    set_buffer_uptodate( bh );

    if ( buffer_off + bh->b_size > valid ) {
      unsigned off = valid > buffer_off? valid - buffer_off : 0;

      local_irq_save( flags );
      zero_user_segment( page, bh_off + off, bh_off + bh->b_size );
      local_irq_restore( flags );
    }
  } else {
    clear_buffer_uptodate( bh );
    printk_ratelimited( KERN_ERR QUOTED_UFSD_DEVICE ": \"%s\" (\"%s\"): buffer read error, logical block 0x%" PSCT "x.", current->comm, i->i_sb->s_id, bh->b_blocknr );
  }

  spin_lock_irqsave( &first->b_uptodate_lock, flags );
  clear_buffer_async_read( bh );
  unlock_buffer( bh );
  tmp = bh;
  do {
    if ( !buffer_uptodate( tmp ) )
      page_uptodate = 0;

    if ( buffer_async_read( tmp ) ) {
      BUG_ON(!buffer_locked( tmp ));
      spin_unlock_irqrestore(&first->b_uptodate_lock, flags);
      return;
    }
  } while( bh != ( tmp = tmp->b_this_page ) );

  spin_unlock_irqrestore(&first->b_uptodate_lock, flags);

  if ( !uptodate ){
    SetPageError( page );
  }else if ( page_uptodate )
    SetPageUptodate( page );

  unlock_page( page );
}


///////////////////////////////////////////////////////////
// ufsd_end_io_read
//
// I/O completion handler for multipage BIOs
///////////////////////////////////////////////////////////
static void
ufsd_end_io_read(
    IN struct bio *bio
    )
{
  int err = BLK_STS_OK != bio->bi_status? -EIO : 0;
#if 0
  struct folio_iter fi;

  bio_for_each_folio_all(fi, bio) {
    if (err)
      folio_set_error(fi.folio);
    else
      folio_mark_uptodate(fi.folio);
    folio_unlock(fi.folio);
  }
#else
  struct bio_vec *bvec;
  struct inode *i = bio->bi_io_vec[0].bv_page->mapping->host;
  unode *u        = UFSD_U( i );
  struct bvec_iter_all iter_all;

  bio_for_each_segment_all( bvec, bio, iter_all) {
    struct page *page = bvec->bv_page;
    if ( !err ) {
      unsigned long flags;
      loff_t page_off = (loff_t)page->index << PAGE_SHIFT;
      loff_t i_size, valid = get_valid_size( u, &i_size, NULL );
      if ( valid > i_size )
        valid = i_size;

      if ( page_off + PAGE_SIZE > valid ) {
        local_irq_save( flags );
        zero_user_segment( page, valid > page_off? valid - page_off : 0, PAGE_SIZE );
        local_irq_restore( flags );
      }
      SetPageUptodate( page );
    } else {
      ClearPageDirty( page );
      SetPageError( page );
    }
    unlock_page( page );
  }

  if ( err )
    printk_ratelimited( KERN_ERR QUOTED_UFSD_DEVICE ": \"%s\" (\"%s\"): bio read error", current->comm, i? i->i_sb->s_id : "" );
#endif
  bio_put( bio );
}


///////////////////////////////////////////////////////////
// ufsd_end_io_write
//
// I/O completion handler for multipage BIOs
///////////////////////////////////////////////////////////
static void
ufsd_end_io_write(
    IN struct bio *bio
    )
{
  int err = BLK_STS_OK != bio->bi_status? -EIO : 0;
  struct folio_iter fi;

  bio_for_each_folio_all(fi, bio) {
    if (err)
      mapping_set_error(fi.folio->mapping, err);
    folio_end_writeback(fi.folio);
  }

  bio_put( bio );
}


///////////////////////////////////////////////////////////
// mpage_alloc
//
// allocates bio for 'nr_vecs' of iovecs
///////////////////////////////////////////////////////////
static struct bio*
mpage_alloc(
    IN struct block_device *bdev,
    IN sector_t first_sector,
    IN unsigned nr_vecs,
    IN blk_opf_t opf
    )
{
  while( 1 ) {
    struct bio *bio = bio_alloc( bdev, nr_vecs, opf, GFP_NOFS|__GFP_HIGH ); // GFP_NOIO
    if ( likely( bio ) ) {
      bio->bi_iter.bi_sector = first_sector;
      DebugTrace( 0, UFSD_LEVEL_BIO, ("bio+: o=%" PSCT "x", first_sector << 9 ));
      return bio;
    }

    if ( !(current->flags & PF_MEMALLOC) )
      return NULL;

    nr_vecs >>= 1;
    if ( !nr_vecs )
      return NULL;
  }
}


///////////////////////////////////////////////////////////
// ufsd_bio_read_submit
//
// submit read bio ( from fs/mpage.c )
///////////////////////////////////////////////////////////
static void
ufsd_bio_read_submit(
    IN struct bio *bio
    )
{
  assert( !(bio->bi_iter.bi_size & 0x1ff) );
  DebugTrace( 0, UFSD_LEVEL_BIO, ("submit_bio read at o=%" PSCT "x, sz=%x, cnt=%x", bio->bi_iter.bi_sector << 9, bio->bi_iter.bi_size, (unsigned)bio->bi_vcnt ));
  bio->bi_end_io = ufsd_end_io_read;
  submit_bio( bio );
}


///////////////////////////////////////////////////////////
// ufsd_bio_write_submit
//
// we count pages, that are about to be written to disk and
// submit write bio ( from fs/mpage.c )
///////////////////////////////////////////////////////////
static void
ufsd_bio_write_submit(
    IN struct bio *bio,
    IN OUT usuper *sbi
    )
{
  if ( unlikely( sbi->options.wbMb_in_pages )
    && atomic_sub_return( bio->bi_vcnt, &sbi->dirty_pages_count ) < 0 ) {
#ifdef UFSD_DEBUG
    ufsd_printk( sbi->sb, " dirty_pages_count < 0 " );
#endif
    atomic_set( &sbi->dirty_pages_count, 0 );
  }

  assert( !(bio->bi_iter.bi_size & 0x1ff) );
  DebugTrace( 0, UFSD_LEVEL_BIO, ("submit_bio write at o=%" PSCT "x, sz=%x, cnt=%x", bio->bi_iter.bi_sector << 9, bio->bi_iter.bi_size, (unsigned)bio->bi_vcnt ));
  bio->bi_end_io = ufsd_end_io_write;

  submit_bio( bio );
}


#ifdef UFSD_USE_READ_WRITE
///////////////////////////////////////////////////////////
// ufsd_file_read
//
// Helper function to read resident/compressed files
///////////////////////////////////////////////////////////
static int
ufsd_file_read(
    IN usuper *sbi,
    IN unode  *u,
    IN struct page *page,
    IN loff_t vbo
    )
{
  size_t ret;
  int err;
  char *kaddr;
  unsigned from = vbo & (PAGE_SIZE-1);

  //
  // Read file via UFSD -> ufsd_bd_read
  //
  DebugTrace( 0, Dbg, ("r=%lx: use ufsd to read at off %llx", u->i.i_ino, vbo ));

  lock_ufsd( sbi );

  kaddr = kmap( page );
  err   = ufsdapi_file_read( sbi->ufsd, u->ufile, NULL, 0, vbo - from, PAGE_SIZE, kaddr, &ret );
  if ( likely( !err ) ) {
    if ( ret < PAGE_SIZE )
      memset( kaddr + ret, 0, PAGE_SIZE - ret );
    SetPageUptodate( page );
  } else {
    ret = err;
    SetPageError( page );
  }
  kunmap( page );
  flush_dcache_page( page );

  unlock_ufsd( sbi );

  return ret;
}


///////////////////////////////////////////////////////////
// ufsd_file_write
//
// Helper function to write resident/compressed files
///////////////////////////////////////////////////////////
static int
ufsd_file_write(
    IN usuper *sbi,
    IN unode  *u,
    IN struct page *page,
    IN loff_t vbo,
    IN size_t len
    )
{
  int err;
  loff_t i_size;

  //
  // Write file via UFSD -> ufsd_bd_write
  //
  DebugTrace( 0, Dbg, ("r=%lx: use ufsd to write at off %llx + %zx", u->i.i_ino, vbo, len ));

  lock_ufsd( sbi );

  i_size = i_size_read( &u->i );
  if ( vbo <= i_size ) {
    UINT64 allocated;
    size_t written;
    char *kaddr;
    unsigned from = vbo & (PAGE_SIZE-1);
    if ( vbo + len > i_size )
      len = i_size - vbo;

    kaddr = kmap( page );
    err   = ufsdapi_file_write( sbi->ufsd, u->ufile, NULL, 0, vbo, len, kaddr + from, &written, &allocated );
    kunmap( page );
    if ( !err )
      inode_set_bytes( &u->i, allocated );

  } else {
    err = 0;
  }

  unlock_ufsd( sbi );

  if ( unlikely( err ) ) {
    ufsd_printk( u->i.i_sb, "failed to write inode 0x%lx, %d", u->i.i_ino, err );
    return -EIO;
  }

  return 0;
}
#endif // #ifdef UFSD_USE_READ_WRITE


///////////////////////////////////////////////////////////
// ufsd_read_folio
//
// address_space_operations::read_folio
///////////////////////////////////////////////////////////
static int
ufsd_read_folio(
    IN struct file  *file,
    IN struct folio *folio
    )
{
  int err;
  struct page *page = &folio->page;
  loff_t page_off = (loff_t)page->index << PAGE_SHIFT;
  struct inode *i = page->mapping->host;
  unode *u        = UFSD_U( i );
  struct super_block *sb = i->i_sb;
  usuper *sbi     = UFSD_SB( sb );
  upage_data mpage;
  mapinfo map;
  unsigned blocksize, bh_off;
  struct buffer_head *bh, *head, *arr[MAX_BUF_PER_PAGE];
  int nr;
//    int fully_mapped = 1;
  loff_t i_size, valid, vbo, lbo;

  mpage.bio = NULL;

  BUG_ON( PageUptodate( page ) );

  valid = get_valid_size( u, &i_size, NULL );

  DebugTrace( +1, UFSD_LEVEL_PAGE_RW, ("readpage: r=%lx, o=%llx, sz=%llx,%llx", i->i_ino, page_off, u->valid, i_size ));

  if ( unlikely( page->index >= ( i_size + PAGE_SIZE - 1 ) >> PAGE_SHIFT ) ){
zero:
    zero_user_segment( page, 0, PAGE_SIZE );
    SetPageUptodate( page );
    unlock_page( page );
    DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("readpage -> full zero" ));
    return 0;
  }

  if ( !page_has_buffers( page ) ) {
    //
    // Check if we can read page without buffers
    //
    DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("readpage - no buf at page" ));

#ifdef UFSD_USE_READ_WRITE
    if ( is_compressed( u ) ) {
use_ufsd:
      err = ufsd_file_read( sbi, u, page, page_off );
      unlock_page( page );
      if ( err > 0 )
        err = 0;

      DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("readpage -> %d", err ));
      return err;
    }
#endif

    //
    // map to read
    //
    if ( unlikely( page_off >= valid || vbo_to_lbo( sbi, u, page_off, 0, &map ) ) )
      goto zero;

#ifdef UFSD_USE_READ_WRITE
    if ( is_ntfs( sbi ) || is_btrfs( sbi ) || is_apfs( sbi ) || is_xfs( sbi ) || is_refs3( sbi ) || is_refs34( sbi ) ) {
      if ( UFSD_VBO_LBO_HOLE == map.lbo || FlagOn( map.flags, UFSD_MAP_LBO_NOTINITED ) ) {
        if ( map.len >= PAGE_SIZE )
          goto zero;
      } else if ( UFSD_VBO_LBO_RESIDENT == map.lbo || UFSD_VBO_LBO_ENCRYPTED == map.lbo || UFSD_VBO_LBO_COMPRESSED == map.lbo ){
        goto use_ufsd;
      }
    }
#endif

    //
    // Check page for continues
    //
    if ( map.len < PAGE_SIZE ) {
#ifdef UFSD_USE_SPARSE
      if ( UFSD_VBO_LBO_HOLE == map.lbo && page_off + map.len >= valid ) {
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("readpage - zero page" ));
        goto zero;
      }
#endif
      DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("readpage confused(1)" ));
      goto buf_read;
    }

    bh_off  = PAGE_SIZE;
    lbo     = map.lbo;

    //
    // here we have valid 'start_lbo'
    // Try to merge with previous request
    //
    if ( mpage.bio && mpage.next_lbo != lbo ) {
      ufsd_bio_read_submit( mpage.bio );
      goto alloc_new;
    }

    if ( !mpage.bio ) {
alloc_new:
      if ( lbo >= sbi->dev_size ) {
        ufsd_printk( sb, "readpage: r=%lx, o=%llx, sz=%llx,%llx: lbo %llx >= dev_size %llx",
                     i->i_ino, page_off, u->valid, i_size, lbo, sbi->dev_size );
        BUG_ON( 1 );
      }
      mpage.bio = mpage_alloc( sb->s_bdev, lbo >> 9, 1, REQ_OP_READ );
      if ( !mpage.bio )
        goto buf_read;
    }

    //
    // Read head (full) page
    //
    assert( bh_off );
    err = bio_add_page( mpage.bio, page, bh_off, 0 );
    ufsd_bio_read_submit( mpage.bio );

    if ( err < bh_off )
      goto alloc_new;

    DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("readpage -> ok, submitted" ));
    return 0;
  }

buf_read:
  assert( !mpage.bio );
  blocksize = 1 << i->i_blkbits;
  vbo       = page_off;
  head      = folio_buffers( folio );
  if ( !head )
    head = create_empty_buffers( folio, blocksize, 0 );

  if ( valid > i_size )
    valid = i_size;

  bh      = head;
  nr      = 0;
  map.len = 0;

  do {
    if ( buffer_uptodate( bh ) )
      goto next_block;

    if ( buffer_mapped( bh ) ) {
      DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("readpage - already mapped %llx, bh=%" PSCT "x", vbo, bh->b_blocknr ));
    } else {
//        fully_mapped = 0;
      if ( vbo >= i_size ) {
zero_buf:
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("readpage - zero bh page: [%lx + %x)", bh_offset( bh ), blocksize ));
        zero_user_segment( page, bh_offset( bh ), bh_offset( bh ) + blocksize );
        set_buffer_uptodate( bh );
        goto next_block;
      }

      //
      // map to read
      //
      if ( map.len < blocksize && unlikely( vbo_to_lbo( sbi, u, vbo, 0, &map ) ) ) {
        DebugTrace( 0, UFSD_LEVEL_ERROR, ("**** readpage - failed to get map for r=%lx, %llx, %llx, %llx", i->i_ino, vbo, valid, i_size ));
        SetPageError( page );
        goto zero_buf;
      }

      if ( !map.len )
        goto zero_buf;

#ifdef UFSD_USE_READ_WRITE
      if ( is_ntfs( sbi ) || is_apfs( sbi ) || is_xfs( sbi ) ) {

        if ( UFSD_VBO_LBO_HOLE == map.lbo )
          goto zero_buf;

        if ( UFSD_VBO_LBO_RESIDENT == map.lbo || UFSD_VBO_LBO_COMPRESSED == map.lbo || UFSD_VBO_LBO_ENCRYPTED == map.lbo ) {
          assert( !nr );

          err = ufsd_file_read( sbi, u, page, vbo );
          if ( err < 0 )
            break;

          do {
            set_buffer_uptodate( bh );
          } while ( (bh = bh->b_this_page) != head );

          SetPageUptodate( page );

          if ( page_off + PAGE_SIZE > i_size ) {
            unsigned long flags;
            local_irq_save( flags );
            zero_user_segment( page, i_size > page_off? i_size - page_off : 0, PAGE_SIZE );
            local_irq_restore( flags );
          }
          break;
        }
      }
#endif

      bh->b_bdev    = i->i_sb->s_bdev;
      bh->b_blocknr = map.lbo >> i->i_blkbits;
      set_buffer_mapped( bh );
      DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("readpage - set_mapped %llx -> b=%" PSCT "x", vbo, bh->b_blocknr ));

      if ( vbo >= valid )
        goto zero_buf;
    }

    arr[nr++] = bh;

next_block:
    if ( map.len < blocksize )
      map.len = 0;
    else {
      map.len -= blocksize;
      if ( is_lbo_ok( map.lbo ) )
        map.lbo += blocksize;
    }
    vbo += blocksize;

  } while( (bh = bh->b_this_page) != head );

//    if ( fully_mapped )
//      SetPageMappedToDisk( page );

  if ( !nr ) {
    SetPageUptodate( page );
    unlock_page( page );
  } else {

    int k;

    for ( k = 0; k < nr; ++k ) {
      bh = arr[k];
      lock_buffer( bh );
      bh->b_end_io = ufsd_end_buffer_async_read;
      set_buffer_async_read( bh );
    }

    for ( k = 0; k < nr; ++k ) {
      bh = arr[k];
      if ( buffer_uptodate( bh ) ) {
        ufsd_end_buffer_async_read( bh, 1 );
      } else {
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("submit_bh( b=%" PSCT "x, r )", bh->b_blocknr));
        submit_bh( READ, bh );
      }
    }
  }

  if ( unlikely( err ) )
    ufsd_printk( sb, "failed to read page 0x%llx for inode 0x%lx, (error %d)", (UINT64)page->index, i->i_ino, err );

  DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("readpage -> %d, nr=%d", nr, err ));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_do_writepage
//
// based on fs/mpage.c '__mpage_writepage'
///////////////////////////////////////////////////////////
static int
ufsd_do_writepage(
    IN struct folio* folio,
    IN struct writeback_control *wbc,
    IN OUT void *data
    )
{
  struct page *page   = &folio->page;
  upage_data *mpage   = data;
  loff_t start_lbo    = 0; // not necessary, just to suppress warnings
  struct address_space *mapping = page->mapping;
  struct inode *i     = mapping->host;
  struct super_block *sb = i->i_sb;
  usuper *sbi         = UFSD_SB( sb );
  unode *u            = UFSD_U( i );
  unsigned blkbits    = i->i_blkbits;
  unsigned blocksize  = 1 << blkbits;
  struct buffer_head *head, *bh;
  unsigned first_unmapped = PAGE_SIZE;  // assume that no mapped buffers
//  int uptodate;
  unsigned bh_off = 0;
  int err;
  mapinfo map;
  loff_t i_size, valid = get_valid_size( u, &i_size, NULL );
  pgoff_t end_index, index = page->index;
  loff_t page_off = (loff_t)index << PAGE_SHIFT;
  loff_t vbo;
  int all_done;

  DebugTrace( +1, UFSD_LEVEL_PAGE_RW, ("writepage(%s): r=%lx, o=%llx, sz=%llx,%llx", current->comm, i->i_ino, page_off, u->valid, i_size ));

  if ( page_off >= i_size || !u->ufile ) {
//    ufsd_printk( sb, "writepage(%s): r=%lx, o=%llx, sz=%llx,%llx) -> out of file %pK", current->comm, i->i_ino, page_off, u->valid, i_size, u->ufile );
    BUG_ON( PageWriteback( page ) );
    set_page_writeback( page );
    unlock_page( page );
    end_page_writeback( page );
    DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("writepage -> out of file, sz=%llx,%llx", u->valid, i_size ));
    return 0;
  }

  map.len = 0;
  head = folio_buffers( folio );

  if ( head ) {
    loff_t vbo = page_off;
    bh = head;
//    uptodate   = 1;
    assert( !is_compressed( u ) );

    //
    // Check for all buffers in page
    //
    do {
      loff_t lbo;
      BUG_ON( buffer_locked( bh ) );
      if ( !buffer_mapped( bh ) ) {
        if ( buffer_dirty( bh ) ) {
          DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage confused(1) o=%llx v=%llx", vbo, valid ));
          goto buf_write;
        }
//        if ( !buffer_uptodate( bh ) )
//          uptodate = 0;
        // Save the position of hole
        if ( PAGE_SIZE == first_unmapped )
          first_unmapped = bh_off; // save the position of first unmapped buffer in page
        continue;
      }

      if ( first_unmapped != PAGE_SIZE ) {
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage confused(2) o=%llx v=%llx", vbo, valid ));
        goto buf_write;  // hole -> non-hole
      }

      if ( !buffer_dirty( bh ) || !buffer_uptodate( bh ) ) {
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage confused(3) o=%llx v=%llx", vbo, valid ));
        goto buf_write;
      }

      if ( i_size > valid && vbo >= valid ) {
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage confused(4) o=%llx v=%llx", vbo, valid ));
        goto buf_write;
      }

      lbo = (loff_t)bh->b_blocknr << blkbits;

      if ( lbo >= sbi->dev_size ) {
        ufsd_printk( sb, "writepage (bh): r=%lx, o=%llx, sz=%llx,%llx: bh=%" PSCT "x, lbo %llx >= dev_size %llx",
                     i->i_ino, page_off, u->valid, i_size, bh->b_blocknr, lbo, sbi->dev_size );
        BUG_ON( 1 );
      }

      if ( !bh_off ) {
        start_lbo = lbo;
      } else if ( lbo == start_lbo + bh_off ) {
        // page still is continues
      } else {
        // page is not continues
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage confused(5) o=%llx v=%llx", vbo, valid ));
        goto buf_write;
      }

      vbo     += blocksize;
      bh_off  += blocksize;

    } while ( head != ( bh = bh->b_this_page ) );

    if ( !first_unmapped ) {
      // Page is full unmapped
      DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage confused(6) o=%llx v=%llx", vbo, valid ));
      goto buf_write;
    }
    // First 'first_unmapped' is mapped

  } else {

    unsigned towrite = (page_off + PAGE_SIZE) > i_size? (i_size - page_off) : PAGE_SIZE;

#ifdef UFSD_USE_READ_WRITE
    if ( is_compressed( u ) ) {
use_ufsd:
      err = ufsd_file_write( sbi, u, page, page_off, towrite );

      ClearPageDirty( page );
      if ( unlikely( err ) ) {
        SetPageError( page );
      } else {
        page_off += towrite;
        if ( likely( page_off >= valid ) ){
          set_valid_size( u, page_off );
          mark_inode_dirty( i );
        }
        SetPageUptodate( page );
      }

      BUG_ON( PageWriteback( page ) );
      set_page_writeback( page );
      unlock_page( page );
      end_page_writeback( page );

      DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("writepage -> %d, sz=%llx,%llx", err, u->valid, i_size ));
      return err;
    }
#endif

    //
    // map to write
    //
    err = vbo_to_lbo( sbi, u, page_off, towrite, &map );
    if ( 0 != err ) {
      ufsd_printk( sb, "**** writepage (failed to map, %d): r=%lx, o=%llx, sz=%llx,%llx: out of file",
                   err, i->i_ino, page_off, valid, i_size );
      goto buf_write;
    }

    if ( !map.len )
      goto buf_write;

#ifdef UFSD_USE_READ_WRITE
    if ( is_ntfs( sbi ) || is_apfs( sbi ) || is_xfs( sbi ) ) {
      if ( UFSD_VBO_LBO_RESIDENT == map.lbo )
        goto use_ufsd;
      if ( UFSD_VBO_LBO_COMPRESSED == map.lbo ) {
        assert( !"Impossible" );
        goto use_ufsd;
      }
      BUG_ON( UFSD_VBO_LBO_HOLE == map.lbo );
    }
#endif

    //
    // Check page for continues
    //
    if ( map.len < PAGE_SIZE )
      goto buf_write;

    start_lbo = map.lbo;
    bh_off    = PAGE_SIZE;
  }

  //
  // 'blocks' is not empty. Check if we can merge with previous bio
  //
  if ( mpage->bio && mpage->next_lbo != start_lbo ) {
    //
    // Write previous fragment
    //
    ufsd_bio_write_submit( mpage->bio, sbi );
    goto alloc_new;
  }

  if ( !mpage->bio ) {
alloc_new:
    if ( start_lbo >= sbi->dev_size ) {
      ufsd_printk( sb, "writepage: r=%lx, o=%llx, sz=%llx,%llx: start_lbo %llx >= dev_size %llx",
                   i->i_ino, page_off, u->valid, i_size, start_lbo, sbi->dev_size );
      BUG_ON( 1 );
    }

    mpage->bio = mpage_alloc( sb->s_bdev, start_lbo >> 9, BIO_MAX_VECS, REQ_OP_WRITE );
    if ( !mpage->bio )
      goto buf_write;
  }

  assert( bh_off );
  if ( bio_add_page( mpage->bio, page, bh_off, 0 ) < bh_off ) {
    //
    // Looks like bio request is too big
    // Submit current bio and allocate new
    //
    ufsd_bio_write_submit( mpage->bio, sbi );
    goto alloc_new;
  }

  head = folio_buffers( folio );
  if ( head ) {
    unsigned off = 0;
    bh = head;
    do {
      if ( off == first_unmapped )
        break;
      off += blocksize;
      clear_buffer_dirty( bh );
    } while ( head != ( bh = bh->b_this_page ) );
  }

  BUG_ON( PageWriteback( page ) );
  set_page_writeback( page );
  unlock_page( page );

  if ( PAGE_SIZE == bh_off ) {
    mpage->next_lbo = start_lbo + PAGE_SIZE;
    DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("writepage -> ok, next=%llx, sz=%llx,%llx", mpage->next_lbo, u->valid, i_size ));
  } else {
    ufsd_bio_write_submit( mpage->bio, sbi );
    mpage->bio = NULL;
    DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("writepage -> ok (sumitted) sz=%llx,%llx", u->valid, i_size ));
  }

  return 0;

buf_write:
  if ( mpage->bio ) {
    ufsd_bio_write_submit( mpage->bio, sbi );
    mpage->bio = NULL;
  }

  end_index = i_size >> PAGE_SHIFT;
  assert( !is_compressed( u ) );

  BUG_ON( !PageLocked( page ) );

  if ( unlikely( index >= end_index ) ) {
    unsigned offset = i_size & (PAGE_SIZE-1);
    if ( unlikely( index >= end_index+1 || !offset ) ) {
      block_invalidate_folio( folio, 0, folio_size(folio) );
      unlock_page( page );
      DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("writepage - (out of size) -> 0" ));
      return 0;
    }

    DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage - zero_user_segment from %x", offset ));
    zero_user_segment( page, offset, PAGE_SIZE );
  }

  //
  // Below is modified variant of '__block_write_full_page'
  //
  head = folio_buffers( folio );
  if ( !head )
    head = create_empty_buffers( folio, blocksize, (1u<<BH_Uptodate) | (1u<<BH_Dirty) );

  bh    = head;
  vbo   = page_off;

  do {
    loff_t block_end = vbo + blocksize;
    size_t towrite;
    assert( page == bh->b_page );

    DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage - o=%llx b=%" PSCT "x, st=%lx", vbo, bh->b_blocknr, bh->b_state ));

    if ( vbo >= i_size ) {
      clear_buffer_dirty( bh );
      set_buffer_uptodate( bh );
      DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage - o=%llx out of size", vbo ));
      goto next_block;
    }

    if ( buffer_mapped( bh ) ) {
      DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage - buffer mapped o=%llx -> b=%" PSCT "x", vbo, bh->b_blocknr ));
      goto next_block;
    }

    if ( !buffer_dirty( bh ) ) {
      DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage - not dirty %llx -> b=%" PSCT "x", vbo, bh->b_blocknr ));
      goto next_block;
    }

    bh->b_bdev  = sb->s_bdev;
    towrite     = block_end > i_size ? (size_t)(i_size - vbo) : blocksize;

    //
    // map to read (to write if compressed)
    //
    if ( map.len < blocksize ){
      err = vbo_to_lbo( sbi, u, vbo, is_compressed( u )? towrite : 0, &map );
      if ( unlikely( err ) ) {
        ufsd_printk( sb, "failed to map r=%lx, vbo %llx, err=%d", i->i_ino, vbo, err );

nomap:
//      bh->b_blocknr = -1;
        clear_buffer_mapped( bh );
        clear_buffer_dirty( bh );
        zero_user_segment( page, bh_offset( bh ), bh_offset( bh ) + blocksize );
        set_buffer_uptodate( bh );
        goto next_block;
      }
    }

    if ( !map.len )
      goto nomap;

#ifdef UFSD_USE_READ_WRITE
    if ( is_ntfs( sbi ) || is_apfs( sbi ) || is_xfs( sbi ) ) {
      assert( UFSD_VBO_LBO_COMPRESSED != map.lbo );
      if ( UFSD_VBO_LBO_HOLE == map.lbo || UFSD_VBO_LBO_COMPRESSED == map.lbo )
        goto nomap;

      if ( UFSD_VBO_LBO_RESIDENT == map.lbo ) {
        //
        // File is resident
        //
        err = ufsd_file_write( sbi, u, page, vbo + bh_offset( bh ), towrite );
        if ( unlikely( err ) )
          break;

//      SetPageUptodate( page );
        set_buffer_uptodate( bh );
        clear_buffer_dirty( bh );
        goto next_block;
      }
    }
#endif

    bh->b_blocknr = map.lbo >> blkbits;
    DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage - set_mapped %llx -> b=%" PSCT "x", vbo, bh->b_blocknr ));
    set_buffer_mapped( bh );

next_block:
    if ( map.len < blocksize )
      map.len = 0;
    else {
      map.len -= blocksize;
      if ( is_lbo_ok( map.lbo ) )
        map.lbo += blocksize;
    }
    vbo = block_end;

  } while( (bh = bh->b_this_page) != head );

  if ( !PageUptodate( page ) ) {
    bh = head;
    while ( buffer_uptodate( bh ) ) {
      bh = bh->b_this_page;
      if ( head == bh ) {
        // All buffers uptodate -> page uptodate
        SetPageUptodate( page );
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("writepage - SetPageUptodate" ));
        break;
      }
    }
  }

  bh = head;
  do {
    if ( !buffer_mapped( bh ) || !buffer_dirty( bh ) ) {
      if ( err && -ENOMEM != err )
        clear_buffer_dirty( bh );
      continue;
    }
    lock_buffer( bh );
    if ( test_clear_buffer_dirty( bh ) ) {
      mark_buffer_async_write( bh );
    } else{
      unlock_buffer( bh );
    }

  } while ( (bh = bh->b_this_page) != head );

  if ( unlikely( err ) )  {
    if ( -EOPNOTSUPP == err )
      err = 0;
    else if ( -ENOMEM == err ) {
      ufsd_printk( sb, "error allocating memory. redirtying page to try again later." );
      redirty_page_for_writepage( wbc, page );
      err = 0;
    } else{
      mapping_set_error( page->mapping, err );
      SetPageError( page );
    }
  }

  BUG_ON( PageWriteback( page ) );
  all_done = 1;
  set_page_writeback( page );

  assert( bh == head );
  do {
    struct buffer_head *next = bh->b_this_page;
    if ( buffer_async_write( bh ) ) {
      DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("submit_bh( b=%" PSCT "x, w )", bh->b_blocknr ));
      submit_bh( WRITE, bh );
      all_done = 0;
    }
    bh = next;
  } while( bh != head );

  unlock_page( page );
  if ( all_done )
    end_page_writeback( page );

  if ( unlikely( err ) )
    mapping_set_error( mapping, err );

  DebugTrace( -1, UFSD_LEVEL_PAGE_RW, ("writepage -> %d (buf), sz=%llx,%llx", err, u->valid, i_size ));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_write_begin
//
// fs/buffer.c block_write_begin + __block_write_begin
// address_space_operations::write_begin
///////////////////////////////////////////////////////////
static int
ufsd_write_begin(
    IN struct file    *file,
    IN struct address_space *mapping,
    IN loff_t         pos,
    IN unsigned       len,
#if is_decl( WRITE_BEGIN_V2 )
    OUT struct folio  **foliop,
#else
    OUT struct page   **pagep,
#endif
    OUT void          **fsdata
    )
{
  int err = 0;
  struct buffer_head *bh, *head, *wait[2], **wait_bh=wait;
  struct inode *i = mapping->host;
  unode *u = UFSD_U( i );
  struct super_block *sb = i->i_sb;
  usuper *sbi   = UFSD_SB( sb );
  loff_t end    = pos + len;
  unsigned from = pos & (PAGE_SIZE - 1);
  unsigned to   = from + len;
  unsigned block_start;
  loff_t page_off = pos & ~(loff_t)( PAGE_SIZE - 1 );
  const unsigned blkbits    = i->i_blkbits;
  const unsigned blocksize  = 1 << blkbits;
  loff_t vbo, i_size0;
  loff_t valid = get_valid_size( u, &i_size0, NULL );
  loff_t i_size = i_size0;
  struct page *page;
  struct folio* folio;
  mapinfo map;
  int dirty = 0;
  int PageUpt;

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  DebugTrace( +1, UFSD_LEVEL_WBWE, ("write_begin: r=%lx, o=%llx,%x sz=%llx,%llx%s",
                        i->i_ino, pos, len, valid, i_size0, is_sparsed( u )?",sp":"" ));

  assert( inode_is_locked( i ) );

  if ( unlikely( end > i_size0 ) ) {
    err = ufsd_set_size_ufsd( i, i_size0, end );
    if ( unlikely( err ) )
      goto restore;

    dirty   = 1;
    i_size  = end;
  }

  if ( !is_compressed( u ) && unlikely( pos > valid ) ) {
    err = ufsd_extend_initialized_size( file, u, valid, pos, false );
    if ( unlikely( err < 0 ) )
      goto restore;
  }

  if ( dirty )
    mark_inode_dirty( i );

#if is_decl( WRITE_BEGIN_V2 )
  folio = __filemap_get_folio( mapping, pos >> PAGE_SHIFT, FGP_WRITEBEGIN, mapping_gfp_mask(mapping));
  if (unlikely( !folio ) ) {
    assert(0);
    err = PTR_ERR(folio);
    goto restore;
  }
  page = folio_page( folio, 0 );
  *foliop = folio;
#else
  page = grab_cache_page_write_begin( mapping, pos >> PAGE_SHIFT );
  if ( unlikely( !page ) ) {
    ufsd_printk( sb, "failed to allocate page cache page for inode 0x%lx at start 0x%llx.", i->i_ino, pos );
    err = -ENOMEM;
    goto restore;
  }
  *pagep  = page;
  folio   = page_folio( page );
#endif

#ifdef UFSD_USE_SPARSE
  if ( is_compressed( u ) ) {
use_ufsd:
    *fsdata = (void*)(size_t)1;
    goto out;
  }
  *fsdata = (void*)(size_t)0;
#endif

  PageUpt = PageUptodate( page );
  atomic_inc( &sbi->dirty_pages_count );

  head = folio_buffers( folio );
  if ( !head  ) {
    if ( !is_sparsed( u ) ) {
      if ( likely( !from && PAGE_SIZE == to ) ) {
        DebugTrace( 0, UFSD_LEVEL_WBWE, ("full page" ));
        goto out;
      }

      if ( unlikely( PageUpt ) ) {
        DebugTrace( 0, UFSD_LEVEL_WBWE, ("!full page + page_uptodate" ));
        goto out;
      }
    }

    head = create_empty_buffers( folio, blocksize, 0 );
  }

  vbo         = page_off;
  bh          = head;
  map.len     = 0;
  block_start = 0;

  do {

    unsigned block_end = block_start + blocksize;

    if ( block_end <= from || block_start >= to ) {
      DebugTrace( 0, UFSD_LEVEL_WBWE, ("write_begin - out of request %llx + %x, bh: %lx%s", vbo, blocksize, bh->b_state, PageUpt? ",upt":"" ));
      if ( PageUpt && !buffer_uptodate( bh ) )
        set_buffer_uptodate( bh );
      goto next_block;
    }

    if ( vbo >= i_size ) {
      ufsd_printk( sb, "write_begin: r=%lx, pos=%llx, len=%x, o=%llx, sz=%llx,%llx,%llx",
                   i->i_ino, pos, len, vbo, u->valid, i_size0, i->i_size );
      BUG_ON( 1 );
    }

    if ( buffer_mapped( bh ) ) {
      DebugTrace( 0, UFSD_LEVEL_WBWE, ("write_begin - buffer mapped %llx, bh=%" PSCT "x", vbo, bh->b_blocknr ));
    } else {
      size_t to_map = (vbo + blocksize) > i_size? (i_size - vbo) : blocksize;
      //
      // Buffer is not mapped
      //
      bh->b_bdev = sb->s_bdev;

      if ( unlikely( map.len < to_map ) ){
        err = vbo_to_lbo( sbi, u, vbo, to_map, &map );

        if ( !err && map.len < to_map )
          err = -EINVAL;

        if ( err ){
          ufsd_printk( sb, "failed to map %llx of inode %lx, size=%llx,%llx, err=%d", vbo, i->i_ino, u->valid, i_size, err );
          break;
        }
      }

#ifdef UFSD_USE_SPARSE
      if ( is_ntfs( sbi ) || is_refs34( sbi ) || is_refs3( sbi ) || is_apfs( sbi ) || is_xfs( sbi ) ) {
        assert( UFSD_VBO_LBO_HOLE != map.lbo );
        assert( UFSD_VBO_LBO_COMPRESSED != map.lbo );

        if ( !is_lbo_ok( map.lbo ) ) {
          DebugTrace( 0, UFSD_LEVEL_WBWE, ("write_begin - use ufsd %llx", vbo ));
          goto use_ufsd;
        }

        if ( is_sparsed( u ) && FlagOn( map.flags, UFSD_MAP_LBO_NEW ) )
          ufsd_sparse_cluster( i, page, vbo, map.len );
      }
#endif

      bh->b_blocknr = map.lbo >> blkbits;

      if ( map.lbo >= sbi->dev_size ) {
        ufsd_printk( sb, "write_begin: r=%lx, pos=%llx, len=%x, o=%llx, sz=%llx,%llx,%llx: bh=%" PSCT "x, lbo=%llx,%llx >= dev_size %llx",
                     i->i_ino, pos, len, vbo, u->valid, i_size0, i->i_size, bh->b_blocknr, map.lbo, map.len, sbi->dev_size );
        BUG_ON( 1 );
      }

      DebugTrace( 0, UFSD_LEVEL_WBWE, ("write_begin - set_mapped %llx -> b=%" PSCT "x", vbo, bh->b_blocknr ));
      set_buffer_mapped( bh );
    }

    if ( PageUpt ) {
      if ( !buffer_uptodate( bh ) )
        set_buffer_uptodate( bh );
      goto next_block;
    }

    if ( !buffer_uptodate( bh ) && (block_start < from || block_end > to) ) {
      valid = get_valid_size( u, NULL, NULL );
      if ( vbo < valid ) {
        DebugTrace( 0, UFSD_LEVEL_WBWE, ("write_begin - read %llx, b=%" PSCT "x", vbo, bh->b_blocknr ));
        lock_buffer( bh );
        bh->b_end_io = end_buffer_read_sync;
        get_bh( bh );
        submit_bh( READ, bh );
        *wait_bh++ = bh;
      } else {
        DebugTrace( 0, UFSD_LEVEL_WBWE, ("write_begin - zero_user %llx, b=%" PSCT "x + %lx", vbo, bh->b_blocknr, bh_offset( bh ) ));
        zero_user_segment( page, bh_offset( bh ), bh_offset( bh ) + blocksize );
        set_buffer_uptodate( bh );
      }
    }

next_block:
    if ( map.len < blocksize )
      map.len = 0;
    else {
      map.len -= blocksize;
      if ( is_lbo_ok( map.lbo ) )
        map.lbo += blocksize;
    }
    vbo += blocksize;
    block_start  = block_end;

  } while( head != (bh = bh->b_this_page) );

  //
  // If we issued read requests - let them complete.
  //
  while( unlikely( wait_bh > wait ) ) {
    bh = *--wait_bh;
    wait_on_buffer( bh );
    DebugTrace( 0, UFSD_LEVEL_WBWE, ("write_begin - wait %" PSCT "x, page_off=%llx, v=%llx", bh->b_blocknr, page_off, u->valid ));
    if ( !buffer_uptodate( bh ) ) {
      if ( !err )
        err = -EIO;
      ClearPageUptodate( page );
    } else {
      loff_t block_end = bh_offset( bh ) + page_off;

      if ( valid < block_end + blocksize ) {
        unsigned start = valid > block_end? (valid - block_end) : 0;
        unsigned start_page = start + bh_offset( bh );
        DebugTrace( 0, UFSD_LEVEL_WBWE, ( "write_begin - page_off=%llx, block_end=%llx, valid=%llx, zero_user_segment( %x, %lx )", page_off, block_end, valid, start_page, PAGE_SIZE ));
        zero_user_segment( page, start_page, PAGE_SIZE );
      }
    }
  }

  if ( unlikely( err ) ) {
#if is_decl( WRITE_BEGIN_V2 )
    folio_unlock(folio);
    folio_put(folio);
#else
    unlock_page( page );
    put_page( page );
#endif

restore:
    ufsd_printk( sb, "write_begin failed for inode 0x%lx, [%llx + %x), size=%llx,%llx, error %d).", i->i_ino, pos, len, u->valid, i->i_size, err );

    if ( i->i_size > i_size0 )
      ufsd_set_size( i, i->i_size, i_size0 );

#if is_decl( WRITE_BEGIN_V2 )
    *foliop = NULL;
#else
    *pagep = NULL;
#endif
  }

out:
  DebugTrace( -1, UFSD_LEVEL_WBWE, ("write_begin -> %d, sz=%llx,%llx", err, u->valid, i->i_size));

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_write_end
//
// fs/buffer.c: generic_write_end
// address_space_operations::write_end
///////////////////////////////////////////////////////////
static int
ufsd_write_end(
    IN struct file  *file,
    IN struct address_space *mapping,
    IN loff_t       pos,
    IN unsigned     len,
    IN unsigned     copied,
#if is_decl( WRITE_BEGIN_V2 )
    IN struct folio *folio,
#else
    IN struct page  *page,
#endif
    IN void         *fsdata
    )
{
#if is_decl( WRITE_BEGIN_V2 )
  struct page  *page = &folio->page;
#endif
  struct inode *i = page->mapping->host;
  const unsigned blkbits = i->i_blkbits;
  unode *u        = UFSD_U( i );
  int dirty       = 0;
  int PageUpt     = PageUptodate( page );
  struct super_block *sb = i->i_sb;
#if defined UFSD_DEBUG || defined UFSD_USE_READ_WRITE
  usuper *sbi     = UFSD_SB( sb );
#endif
  unsigned long flags;
  int err         = copied >= len || PageUpt? copied : 0;
  loff_t end      = pos + err;
  loff_t page_off = (loff_t)page->index << PAGE_SHIFT;

  assert( copied == len ); // just to test
  assert( inode_is_locked( i ) );
  assert( page->index == (pos >> PAGE_SHIFT) );

  DebugTrace( +1, UFSD_LEVEL_WBWE, ("write_end: r=%lx, pos=%llx,%x,%x s=%llx,%llx, pf=%lx",
              i->i_ino, pos, len, copied, u->valid, i->i_size, page->flags ));

//  flush_dcache_page( page ); //??

#ifdef UFSD_USE_READ_WRITE
  assert( !file || !is_stream( file ) );
  if ( fsdata ) {
    size_t ret;
    unsigned from   = pos & (PAGE_SIZE-1);
    unsigned to     = from + len;
    char *kaddr     = kmap( page );
    assert( sbi->rw_buffer );

    lock_ufsd( sbi );

    if ( PageUpt )
      err = 0;
    else if ( PAGE_SIZE == len ) {
      err = 0;
      SetPageUptodate( page );
    } else {

//      DebugTrace( 0, UFSD_LEVEL_WBWE, ("ufsdapi_file_read( o=%llx )", page_off ));
      err = ufsdapi_file_read( sbi->ufsd, u->ufile, NULL, 0, page_off, PAGE_SIZE, sbi->rw_buffer, &ret );

      if ( likely( !err ) ) {
        if ( ret < PAGE_SIZE )
          memset( sbi->rw_buffer + ret, 0, PAGE_SIZE - ret );

        //
        // Update page
        //
        memcpy( kaddr, sbi->rw_buffer, from );
        memcpy( kaddr + to, sbi->rw_buffer + to, PAGE_SIZE - to );
        SetPageUptodate( page );

      } else {
        err = -EIO;
      }
    }

    if ( likely( !err ) ) {
      UINT64 allocated;
      err = ufsdapi_file_write( sbi->ufsd, u->ufile, NULL, 0, page_off + from, copied, kaddr + from, &ret, &allocated );
      if ( !err )
        inode_set_bytes( &u->i, allocated );
    }

    unlock_ufsd( sbi );

    kunmap( page );
    flush_dcache_page( page );

    if ( unlikely( err ) ) {
      SetPageError( page );
    } else {
      if ( PAGE_SIZE == copied )
        ClearPageDirty( page ); //clear page dirty so that writepages wouldn't work for us

      if ( unlikely( page_has_buffers( page ) ) ) {
        struct buffer_head *bh, *head;

        head  = bh = page_buffers( page );
        do {
          set_buffer_uptodate( bh );
          clear_buffer_dirty( bh );
        } while ( head != (bh = bh->b_this_page) );
      }

      err = copied;
    }
  } else
#endif
  {
    // buffer.c: __block_commit_write
    if ( likely( !page_has_buffers( page ) ) ) {
      if ( likely( copied == len ) ) {
        if ( !PageUptodate( page ) )
          SetPageUptodate( page );
        set_page_dirty( page );
      }
    } else {
      struct buffer_head *bh, *head;
      loff_t block_start = page_off;
      const unsigned blocksize = 1 << blkbits;
      int partial = 0;

      bh = head = page_buffers( page );

      do {
        loff_t block_end = block_start + blocksize;

        if ( block_end <= pos || block_start >= end ) {
          if ( !buffer_uptodate( bh ) )
            partial = 1;
        } else {
          set_buffer_uptodate( bh );
          mark_buffer_dirty( bh );
        }
        block_start = block_end;
      } while ( head != ( bh = bh->b_this_page ) );

      if ( !partial && !PageUptodate( page ) )
        SetPageUptodate( page );
    }
  }

  write_lock_irqsave( &u->rwlock, flags );
  if ( end > u->valid ) {
    u->valid = end;
    dirty = 1;
  }

  if ( end > i->i_size ){
    i_size_write( i, end );
    dirty  = 1;
  }
  write_unlock_irqrestore( &u->rwlock, flags );

  unlock_page( page );
  put_page( page );

  if ( dirty )
    mark_inode_dirty( i );

  if ( unlikely( copied != len ) ) {
    loff_t to = pos + len;
    BUG_ON( copied > len );
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("write_end - copied %x < len %x", copied, len ) );
    if ( err )
      ufsd_printk( sb, "partial write inode %lx: (orig copied %u, len %u, actual copied %u).", i->i_ino, copied, len, err );
    else
      ufsd_printk( sb, "write failed inode %lx: (orig copied %u, len %u, actual copied 0).", i->i_ino, copied, len );

    if ( to > i->i_size )
      ufsd_set_size( i, to, i->i_size );
  }

  DebugTrace( -1, UFSD_LEVEL_WBWE, (err > 0? "write_end -> %x s=%llx,%llx" : "write_end: -> %d s=%llx,%llx", err, u->valid, i->i_size) );
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_writepages
//
// address_space_operations::writepages
// based on fs/mpage.c 'mpage_writepages'
///////////////////////////////////////////////////////////
static int
ufsd_writepages(
    IN struct address_space     *mapping,
    IN struct writeback_control *wbc
    )
{
  struct blk_plug plug;
  int err;
  struct inode *i = mapping->host;
  struct super_block *sb = i->i_sb;
  usuper *sbi = UFSD_SB( sb );
  upage_data mpage;

#ifdef UFSD_DEBUG
  // Save current 'nr_to_write' to show the number of written pages on exit
  long nr = wbc->nr_to_write;
  if ( ufsd_trace_level & Dbg ) {
    char tmp[32];
    const char *hint;
    if ( LONG_MAX == nr )
      hint = "all";
    else {
      sprintf( tmp, "%lx", nr );
      hint = tmp;
    }

    ufsd_trace( "%u: writepages r=%lx, %s, \"%s\"", jiffies_to_msecs(jiffies-StartJiffies), i->i_ino, hint, current->comm );
    ufsd_trace_inc( +1 );
  }
#endif

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) ) {
    DEBUG_ONLY( ufsd_trace_inc( -1 ) );
    return -EIO; // TODO +1
  }

  blk_start_plug( &plug );

  // TODO: update 'arch' bit for exfat/ntfs
  mpage.bio  = NULL;

  err = write_cache_pages( mapping, wbc, ufsd_do_writepage, &mpage );

  if ( mpage.bio )
    ufsd_bio_write_submit( mpage.bio, sbi );

  blk_finish_plug( &plug );

  if ( !err ) {
    DebugTrace( -1, Dbg, ("%u: writepages -> ok, %lx%s", jiffies_to_msecs(jiffies-StartJiffies), nr - wbc->nr_to_write, mpage.bio? ", submitted":"" ));
  } else {
    DebugTrace( -1, Dbg, ("writepages -> fail %d%s", err, mpage.bio? ", submitted":"" ));
    ufsd_printk( sb, "Failed due to error(s) for inode 0x%lx (error %d).", i->i_ino, err );
  }

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_bmap
//
// address_space_operations::bmap
///////////////////////////////////////////////////////////
static sector_t
ufsd_bmap(
    IN struct address_space *mapping,
    IN sector_t block
    )
{
  sector_t ret = 0;
  struct inode *i = mapping->host;
  struct super_block *sb = i->i_sb;

  if ( S_ISDIR( i->i_mode ) ) {
    ufsd_printk( sb, "BMAP only makes sense for files, returning 0, inode 0x%lx", i->i_ino );
  } else {
    mapinfo map;
    unode *u  = UFSD_U( i );
    loff_t vbo = (loff_t)block << sb->s_blocksize_bits;

    //
    // map to read
    //
    if ( unlikely( vbo_to_lbo( UFSD_SB( sb ), u, vbo, 0, &map ) ) )
      ret = 0;
    else if ( !is_lbo_ok( map.lbo ) )
      ret = 0; // sparse, resident or compressed
    else
      ret = map.lbo >> sb->s_blocksize_bits;
  }

  VfsTrace( 0, Dbg, ("bmap (r=%lx, b=%" PSCT "x) -> %" PSCT "x", i->i_ino, block, ret ));
  return ret;
}


///////////////////////////////////////////////////////////
// ufsd_get_block_for_direct_IO
//
// call back function for blockdev_direct_IO
///////////////////////////////////////////////////////////
static int
ufsd_get_block_for_direct_IO(
    IN struct inode        *i,
    IN sector_t             iblock,
    IN struct buffer_head  *bh,
    IN int                  create
    )
{
  struct super_block  *sb = i->i_sb;
  usuper  *sbi            = UFSD_SB( sb );
  unode   *u              = UFSD_U( i );
  const unsigned blkbits  = i->i_blkbits;
  const unsigned block_size = 1u << blkbits;
  loff_t vbo = (loff_t)iblock << blkbits;
  mapinfo map;
  loff_t i_size, len = 0;
  loff_t valid   = get_valid_size( u, &i_size, NULL );
  int err = 0;
  size_t bh_size = bh->b_size;

  assert( !bh->b_state );
  assert( bh_size );

  if ( !create && vbo >= valid ) {
    DebugTrace( 0, Dbg, ("get_block -> 0, r=%lx, %" PSCT "x -> out of valid", i->i_ino, iblock  ));
    return 0;
  }

  if ( vbo >= i_size )
    goto out;

  err = vbo_to_lbo( sbi, u, vbo, create? bh_size : 0, &map );
  if ( unlikely( err ) )
    goto out;

  assert( map.len );
  if ( unlikely( !map.len ) )
    goto out;

  if ( vbo + map.len <= i_size )
    len = map.len;
  else
    len = (( i_size + sbi->cluster_mask ) & sbi->cluster_mask_inv) - vbo;

  if ( is_lbo_ok( map.lbo ) ) {
    bh->b_bdev    = sb->s_bdev;
    bh->b_blocknr = map.lbo >> blkbits;
    set_buffer_mapped( bh );
  }

  if (create) {
    /* ntfs_direct_IO will update ni->i_valid. */
    if ( is_sparsed( u ) && FlagOn( map.flags, UFSD_MAP_LBO_NEW ) ) {
      //
      // Do special action if new allocated is bigger than required
      // Not effective but...
      //
      unsigned off = vbo & sbi->cluster_mask;

      if ( off ) {
        //
        // Zero first part of cluster
        //
        ufsd_bd_zero( sb, map.lbo - off, off );
      }

      if ( map.len > bh_size ) {
        //
        // Zero second part of cluster
        //
        ufsd_bd_zero( sb, map.lbo + bh_size, map.len - bh_size );
      }
      set_buffer_new( bh );
    }
    else if (vbo >= valid)
      set_buffer_new(bh);
  } else if (vbo >= valid) {
    // Read out of valid data.
    clear_buffer_mapped(bh);
  } else if (vbo + len <= valid) {
    // Normal read.
  } else if (vbo + block_size <= valid) {
    // Normal short read.
    len = block_size;
  } else {
    // Read across valid size: vbo < valid && valid < vbo + block_size
    // TODO read block and zero tail:
    len = block_size;
  }

out:

  //
  // get_block() is passed the number of i_blkbits-sized blocks which direct_io
  // has remaining to do.  The fs should not map more than this number of blocks.
  //
  // If the fs has mapped a lot of blocks, it should populate bh->b_size to
  // indicate how much contiguous disk space has been made available at
  // bh->b_blocknr.
  //
  // NOTE: 'bh->b_size' is size_t while 'len' if loff_t
  // 'bh->b_size' = len will fail in 32-bit
  //
  {
#ifdef __LP64__
    C_ASSERT( sizeof(size_t) == sizeof(loff_t) );
    bh->b_size = len;
#else
    C_ASSERT( sizeof(size_t) < sizeof(loff_t) );
    bh->b_size = len < 0x40000000u? len : 0x40000000u;
#endif
  }

  DebugTrace( 0, Dbg, ("get_block -> %d, r=%lx, %" PSCT "x -> [%" PSCT "x + %zx,%zx), %lx, %llx", err, i->i_ino, iblock, bh->b_blocknr, bh_size, bh->b_size, bh->b_state, i_size ));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_direct_IO
//
// address_space_operations::direct_IO
///////////////////////////////////////////////////////////
static ssize_t
ufsd_direct_IO(
    IN struct kiocb *iocb,
    IN struct iov_iter *iter
    )
{
  struct inode *i = file_inode( iocb->ki_filp );
  size_t bytes  = iov_iter_count(iter);
  int rw        = iov_iter_rw(iter);
  loff_t vbo    = iocb->ki_pos;

  int wr    = rw & WRITE;
  unode *u  = UFSD_U( i );
  loff_t valid, end;
  ssize_t ret;

  VfsTrace( +1, Dbg, ("direct_IO: r=%lx, %s, [%llx + %zx), s=%llx,%llx, %s, %d", i->i_ino,
              wr? "w":"r", vbo, bytes, u->valid, i->i_size, is_sync_kiocb(iocb) ? "sync" : "async",iter->iter_type));

  ret = __blockdev_direct_IO( iocb, i, i->i_sb->s_bdev, iter, ufsd_get_block_for_direct_IO, NULL, DIO_LOCKING );

  assert( ret >= 0 || -EIOCBQUEUED == ret );
  if ( ret > 0 )
    end = vbo + ret;
  else if ( wr && -EIOCBQUEUED == ret )
    end = vbo + bytes;
  else
    goto out;

  valid = get_valid_size( u, NULL, NULL );

  if ( wr ) {
    if (end > valid && !S_ISBLK(i->i_mode)) {
      set_valid_size( u, end );
      mark_inode_dirty( i );
     }
  } else {
    size_t to_zero = valid <= vbo? bytes : valid < end? (end-valid) : 0;
    if ( to_zero ){
      /* Fix page. */
      iov_iter_revert(iter, to_zero);
      iov_iter_zero(to_zero, iter);
    }
  }

out:
  VfsTrace( -1, Dbg, (ret > 0? "direct_IO -> %zx" : "direct_IO -> %zd", ret ));

  return ret;
}


//
// Address space operations
//
static const struct address_space_operations ufsd_aops = {
  .read_folio     = ufsd_read_folio,
  .writepages     = ufsd_writepages,
  .dirty_folio    = block_dirty_folio,
  .write_begin    = ufsd_write_begin,
  .write_end      = ufsd_write_end,
  .bmap           = ufsd_bmap,
  .direct_IO      = ufsd_direct_IO,
  .invalidate_folio = block_invalidate_folio,
  .is_partially_uptodate  = block_is_partially_uptodate,
};


static struct kmem_cache *unode_cachep;

///////////////////////////////////////////////////////////
// ufsd_alloc_inode
//
// super_operations::alloc_inode
///////////////////////////////////////////////////////////
static struct inode*
ufsd_alloc_inode(
    IN struct super_block *sb
    )
{
  unode *u = kmem_cache_alloc( unode_cachep, GFP_NOFS );
  if ( !u )
    return NULL;

  //
  // NOTE: explicitly zero all unode members from 'ufile' until 'i'
  //
  memset( Add2Ptr(u, offsetof(unode,ufile)), 0, offsetof(unode,i) - offsetof(unode,ufile) );

  return &u->i;
}


///////////////////////////////////////////////////////////
// ufsd_destroy_inode
//
// super_operations::destroy_inode
///////////////////////////////////////////////////////////
static void
ufsd_destroy_inode(
    IN struct inode *i
    )
{
  kmem_cache_free( unode_cachep, UFSD_U( i ) );
}


///////////////////////////////////////////////////////////
// init_once
//
// callback function for 'kmem_cache_create'
///////////////////////////////////////////////////////////
static void
init_once(
    IN void *foo
    )
{
  unode *u = (unode *)foo;

  //
  // NOTE: once init unode members from start to 'ufile'
  //
  rwlock_init( &u->rwlock );

  inode_init_once( &u->i );
}


///////////////////////////////////////////////////////////
// ufsd_symlink
//
// inode_operations::symlink
///////////////////////////////////////////////////////////
static int
ufsd_symlink(
    IN struct mnt_idmap *idmap,
    IN struct inode   *dir,
    IN struct dentry  *de,
    IN const char     *symname
    )
{
  struct inode *i;
  int err;
  ucreate  cr = { NULL, symname, strlen( symname ) + 1, 0, 0, S_IFLNK|S_IRWXUGO };

  VfsTrace( +1, Dbg, ("symlink: r=%lx, /\"%.*s\" -> \"%s\"",
              dir->i_ino, (int)de->d_name.len, de->d_name.name, symname ));

  if ( unlikely( cr.len > PAGE_SIZE ) ) {
    DebugTrace( 0, Dbg, ("symlink name is too long" ));
    err = -ENAMETOOLONG;
    goto out;
  }

  if ( IS_ERR( i = ufsd_create_or_open( dir, de, &cr ) ) )
    err = PTR_ERR( i );
  else {
    err = 0;

    assert( UFSD_FH(i) );
    i->i_op = &ufsd_link_inode_operations_ufsd;

    if ( is_hfs( UFSD_SB( i->i_sb ) ) ) {
      inode_lock( i );
      err = page_symlink( i, symname, cr.len );
      inode_unlock( i );
    }

    inode_nohighmem( i );

    if ( likely( !err ) )
      d_instantiate( de, i );
    else
      drop_nlink( i );

    mark_inode_dirty( i );

    if ( unlikely( err ) )
      iput( i );
  }

out:
  VfsTrace( -1, Dbg, ("symlink -> %d", err ));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_test_inode
//
// compare inodes for equality
// return 1 if match 'ino' and 'generation'
///////////////////////////////////////////////////////////
static int
ufsd_test_inode(
    IN struct inode *i,
    IN void         *data
    )
{
  ufsd_iget5_param *p     = data;

  return i->i_ino == p->fi->Id && i->i_generation == p->fi->Gen;
}


///////////////////////////////////////////////////////////
// ufsd_set_inode
//
// initialize an inode
// return 0 if ok
///////////////////////////////////////////////////////////
static int
ufsd_set_inode(
    IN struct inode *i,
    IN void         *data
    )
{
  ufsd_iget5_param *p     = data;
  unode *u                = UFSD_U( i );
  const ucreate *cr       = p->Create;
  const finfo *fi         = p->fi;
  struct super_block *sb  = i->i_sb;
  usuper *sbi             = UFSD_SB( sb );
  int check_special       = 0;
  mode_t mode;

  C_ASSERT( UFSD_UNODE_FLAG_SPARSE == UFSDAPI_SPARSE && UFSD_UNODE_FLAG_COMPRESS == UFSDAPI_COMPRESSED
         && UFSD_UNODE_FLAG_ENCRYPT == UFSDAPI_ENCRYPTED && UFSD_UNODE_FLAG_EA == UFSDAPI_EA );

  //
  // Next members are set at this point:
  //
  // i->i_sb    = sb;
  // i->i_dev   = sb->s_dev;
  // i->i_blkbits = sb->s_blocksize_bits;
  // i->i_flags = 0;
  //
//  assert( !p->lnk );
  assert( 1 == atomic_read( &i->i_count ) );

  i->i_ino  = p->fi->Id;
  i->i_generation = p->fi->Gen;

  i->i_op = NULL;

  //
  // Setup 'uid' and 'gid'
  //
  i->i_uid = KUIDT_INIT( unlikely(sbi->options.uid)? sbi->options.fs_uid : cr? cr->uid : FlagOn( fi->Attrib, UFSDAPI_UGM )? fi->Uid : sbi->options.fs_uid );
  i->i_gid = KGIDT_INIT( unlikely(sbi->options.gid)? sbi->options.fs_gid : cr? cr->gid : FlagOn( fi->Attrib, UFSDAPI_UGM )? fi->Gid : sbi->options.fs_gid );

  //
  // Setup 'mode'
  //
  if ( FlagOn( fi->Attrib, UFSDAPI_SUBDIR ) ) {
    if ( sbi->options.dmask ) {
      // use mount options "dmask" or "umask"
      mode = S_IRWXUGO & sbi->options.fs_dmask;
    } else if ( cr ) {
      mode = cr->mode;
      check_special = 1;
    } else if ( FlagOn( fi->Attrib, UFSDAPI_UGM ) ) {
      // no mount options "dmask"/"umask" and fs supports "ugm"
      mode     = fi->Mode;
      check_special = 1;
    } else if ( !sb->s_root ) {
      // Read root inode while mounting
      mode = S_IRWXUGO;
    } else {
      // by default ~(current->fs->umask)
      mode = S_IRWXUGO & sbi->options.fs_dmask;
    }
  } else {
    if ( sbi->options.fmask ) {
      // use mount options "fmask" or "umask"
      mode = S_IRWXUGO & sbi->options.fs_fmask;
    } else if ( cr ) {
      mode = cr->mode;
      check_special = 1;
    } else if ( FlagOn( fi->Attrib, UFSDAPI_UGM ) ) {
      // no mount options "fmask"/"umask" and fs supports "ugm"
      mode     = fi->Mode;
      check_special = 1;
    } else {
      // by default ~(current->fs->umask)
      mode = S_IRWXUGO & sbi->options.fs_fmask;
    }
  }

  if ( check_special && ( S_ISCHR(mode) || S_ISBLK(mode) || S_ISFIFO(mode) || S_ISSOCK(mode) ) ) {
    init_special_inode( i, mode, new_decode_dev( fi->Dev ) );
    i->i_op = &ufsd_special_inode_operations;
  } else {
    assert( !cr || !FlagOn( fi->Attrib, UFSDAPI_UGM ) || cr->mode == fi->Mode );
  }

  ufsd_times_to_inode( sbi, fi, i );
  i->i_size = fi->FileSize;

  //
  // Setup unode
  //
  u->flags = fi->Attrib & UFSD_UNODE_FLAG_API_FLAGS;

  u->valid = fi->ValidSize;
  assert( FlagOn( fi->Attrib, UFSDAPI_SUBDIR ) || !FlagOn( fi->Attrib, UFSDAPI_VSIZE ) || fi->ValidSize <= fi->FileSize );
  assert( !p->fh || FlagOn( fi->Attrib, UFSDAPI_VSIZE ) );
//  BUG_ON( u->len );
//  assert( fi->ValidSize <= fi->FileSize );
//  assert( fi->FileSize <= fi->AllocSize );

  inode_set_bytes( i, fi->AllocSize );

  if ( i->i_op ) {
    ;
  } else if ( FlagOn( fi->Attrib, UFSDAPI_SUBDIR ) ) {
    // dot and dot-dot should be included in count but was not included
    // in enumeration.
    assert( 1 == fi->HardLinks ); // Usually a hard links to directories are disabled
    set_nlink( i, fi->HardLinks + p->subdir_count );

    i->i_op   = &ufsd_dir_inode_operations;
    i->i_fop  = &ufsd_dir_operations;
    mode      |= S_IFDIR;
    u->valid  = 0;
  } else {
    assert( fi->HardLinks ); // Is it normal?
    set_nlink( i, fi->HardLinks );

    i->i_op = &ufsd_file_inode_ops;
    i->i_fop    = &ufsd_file_ops;
    i->i_mapping->a_ops = &ufsd_aops;
    mode       |= S_IFREG;
  }

  if ( FlagOn( fi->Attrib, UFSDAPI_RDONLY ) )
    mode &= ~S_IWUGO;

  if ( FlagOn( fi->Attrib, UFSDAPI_LINK ) ) {
    // ntfs supports dir-symlinks but vfs preffers links to be files
    mode = ( mode & ~(S_IFDIR | S_IFREG) ) | S_IFLNK;

    i->i_op = &ufsd_link_inode_operations_ufsd;
    i->i_fop = NULL;

    inode_nohighmem( i );
  }

  if ( S_ISREG( mode ) ){
    set_bit( UFSD_UNODE_FLAG_LAZY_INIT_BIT, &u->flags );
    if ( (sbi->options.sys_immutable && FlagOn( fi->Attrib, UFSDAPI_SYSTEM ))
       || FlagOn( fi->Attrib, UFSDAPI_INTEGRITY|UFSDAPI_DEDUPLICATED ) ) {
      i->i_flags |= S_IMMUTABLE;
    }
  }

  i->i_mode = mode;

  assert( !u->ufile );
  u->ufile  = p->fh;
//  *(struct inode**)Add2Ptr( u->ufile, usdapi_file_inode_offset() ) = i;

  p->fh     = NULL;

  return 0;
}


///////////////////////////////////////////////////////////
// iget5
//
// Helper function to get inode
///////////////////////////////////////////////////////////
static inline struct inode*
iget5(
    IN struct super_block   *sb,
    IN OUT ufsd_iget5_param *p
    )
{
  struct inode *i = iget5_locked( sb, p->fi->Id, ufsd_test_inode, ufsd_set_inode, p );

  if ( likely( i ) && FlagOn( i->i_state, I_NEW ) ) {
    unlock_new_inode( i );
  }

  return i;
}


///////////////////////////////////////////////////////////
// ufsd_create_or_open
//
//  This routine is a callback used to load or create inode for a
//  direntry when this direntry was not found in dcache or direct
//  request for create or mkdir is being served.
///////////////////////////////////////////////////////////
noinline static struct inode*
ufsd_create_or_open(
    IN struct inode       *dir,
    IN OUT struct dentry  *de,
    IN ucreate            *cr
    )
{
  ufsd_iget5_param param = {cr};
  unode *u        = NULL;
  struct inode *i = NULL;
  struct super_block *sb = dir->i_sb;
  usuper *sbi     = UFSD_SB( sb );
  int err = -ENOENT;
#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
  struct posix_acl *acl = NULL;
#endif
  TRACE_ONLY( const char *hint = NULL==cr?"lookup":S_ISDIR(cr->mode)?"mkdir":cr->lnk?"link":S_ISLNK(cr->mode)?"symlink":cr->data?"mknode":"create"; )
#ifdef UFSD_USE_STREAM
  unsigned char *p = sbi->options.delim? strchr( de->d_name.name, sbi->options.delim ) : NULL;
  param.name_len      = p? (p - de->d_name.name) : de->d_name.len;
#else
  param.name_len      = de->d_name.len;
#endif

  param.name    = de->d_name.name;

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return ERR_PTR( -EIO );

  VfsTrace( +1, Dbg, ("%s: r=%lx, '%s' m=%o", hint, dir->i_ino, de->d_name.name, cr? (unsigned)cr->mode : 0u ));
//  DebugTrace( +1, Dbg, ("%s: %pK '%.*s'", hint, dir, (int)param.name_len, param.name));

  //
  // The rest to be set in this routine
  // follows the attempt to open the file.
  //
  lock_ufsd( sbi );

  if ( unlikely( ufsd_open_by_id( sbi, dir ) ) )
    goto Exit; // Failed to open parent directory

  if ( cr ) {
    struct inode *lnk = (struct inode*)cr->lnk;
    if ( lnk ) {
      if ( unlikely( ufsd_open_by_id( sbi, lnk ) ) )
        goto Exit; // Failed to open link node

      cr->lnk = UFSD_FH( lnk );
    }
    cr->uid = __kuid_val( current_fsuid() );
    if ( !(dir->i_mode & S_ISGID) )
      cr->gid = __kgid_val( current_fsgid() );
    else {
      cr->gid = __kgid_val( dir->i_gid );
      if ( S_ISDIR(cr->mode) )
        cr->mode |= S_ISGID;
    }

    if ( !cr->lnk && !S_ISLNK(cr->mode) ) {
#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
      if ( sbi->options.acl ) {
        acl = ufsd_get_acl_ex( dir, ACL_TYPE_DEFAULT, 1 );
        if ( IS_ERR( acl ) ) {
          err = PTR_ERR( acl );
          acl = NULL;
          goto Exit;
        }
      }
      if ( !acl )
#endif
        cr->mode &= ~current_umask();
    }
  }

  err = ufsdapi_file_open( sbi->ufsd, UFSD_FH( dir ), &param );
  if ( err )
    goto Exit;

  assert( !cr || param.fh );
  assert( dir || FlagOn( param.fi->Attrib, UFSDAPI_SUBDIR ) ); // root must be directory

  //
  // Load and init inode
  // iget5 calls 'ufsd_set_inode' for new nodes
  // if node was not loaded then param.fh will be copied into UFSD_FH(inode)
  // and original param.fh will be zeroed
  // if node is already loaded then param.fh will not be changed
  // and we must to close it
  //
  i = iget5( sb, &param );
  if ( unlikely( !i ) ) {
    ufsdapi_file_close( sbi->ufsd, param.fh );
    err = -ENOMEM;
    goto Exit;
  }

  u = UFSD_U( i );

  if ( unlikely( param.fh ) ) {
    // inode was already opened
#ifdef UFSD_NTFS
    if ( !u->ufile ) {
      DebugTrace( 0, Dbg, ("open closed r=%lx", i->i_ino ));
      u->ufile = param.fh;
    } else
#endif
    {
      DebugTrace( 0, Dbg, ("assert: i=%pK, l=%x, old=%pK, new=%pK", i, i->i_nlink, u->ufile, param.fh ));
      // UFSD handle was not used. Close it
      ufsdapi_file_close( sbi->ufsd, param.fh );
    }
  }

  assert( !cr || u->ufile );
  // OK
  err = 0;

  if ( cr ) {
    UINT64 dir_size = ufsdapi_get_dir_size( UFSD_FH( dir ) );
    struct timespec64 ts = ufsd_inode_current_time( sbi );

    if ( ( is_hfs( sbi ) || is_apfs( sbi )) && S_ISDIR ( i->i_mode ) )
      inc_nlink( dir );

    inode_set_mtime_to_ts( dir, inode_set_ctime_to_ts( dir, ts ) );
    // Mark dir as requiring resync.
    i_size_write( dir, dir_size );
    inode_set_bytes( dir, dir_size );

    mark_inode_dirty( dir );

    if ( cr->lnk )
      inode_set_ctime_to_ts( i, ts );
#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
    else if ( acl ) {
      umode_t mode = i->i_mode;

      if ( !S_ISDIR( mode ) || !( err = ufsd_set_acl_ex( i, acl, ACL_TYPE_DEFAULT, 1, true ) ) ) {
        err = __posix_acl_create( &acl, GFP_NOFS, &mode );
        if ( err >= 0 ) {
          if ( mode != i->i_mode ) {
            i->i_mode = mode;
            mark_inode_dirty( i );
          }
          if ( err > 0 )
            err = ufsd_set_acl_ex( i, acl, ACL_TYPE_ACCESS, 1, true );
        }
      }
      if ( unlikely( err ) ) {
        iput( i );
        i = NULL;
      }
    }
#endif
  }

Exit:

  if ( !err && sbi->options.no_acs_rules != u->stored_noacsr ) {
    if ( sbi->options.no_acs_rules ) {
      // "no access rules" mode and uid / gid / mode weren't saved
      u->i_mode = i->i_mode;
      u->i_uid  = i->i_uid;
      u->i_gid  = i->i_gid;
      i->i_mode |= UFSD_NOACSR_MODE;
      i->i_uid  = GLOBAL_ROOT_UID;
      i->i_gid  = GLOBAL_ROOT_GID;
      u->stored_noacsr = 1;
    } else {
      // normal mode and uid / gid / mode weren't restored
      i->i_mode = u->i_mode;
      i->i_uid  = u->i_uid;
      i->i_gid  = u->i_gid;
      u->stored_noacsr = 0;
    }
  }

  unlock_ufsd( sbi );
#if defined CONFIG_FS_POSIX_ACL && defined UFSD_USE_XATTR
  ufsd_posix_acl_release( acl );
#endif

  if ( err ) {
    assert( err < 0 );
    VfsTrace( -1, Dbg, ("%s failed %d", hint, err ));
    return ERR_PTR( err );
  }

  VfsTrace( -1, Dbg, ("%s -> i=%pK de=%pK h=%pK r=%lx, l=%x m=%o%s",
                        hint, i, de, u->ufile,
                        i->i_ino, i->i_nlink, i->i_mode, FlagOn( param.fi->Attrib, UFSDAPI_SPARSE )?",sp" : FlagOn( param.fi->Attrib, UFSDAPI_COMPRESSED )?",c":""));
  return i;
}


#ifdef CONFIG_PROC_FS
static struct proc_dir_entry *proc_info_root = NULL;
#define PROC_FS_UFSD_NAME "fs/"QUOTED_UFSD_DEVICE

///////////////////////////////////////////////////////////
// ufsd_proc_dev_version_show
//
// /proc/fs/ufsd/version
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_version_show(
    IN struct seq_file  *m,
    IN void             *o
    )
{
  seq_printf( m, "%s%s\ndriver (%s), sizeof(inode)=%u\n%s",
              ufsdapi_library_version( NULL ), s_FileVer, s_DriverVer, (unsigned)sizeof(struct inode),
#ifdef DEFAULT_MOUNT_OPTIONS
              "Default options: " DEFAULT_MOUNT_OPTIONS "\n"
#endif
              "" );

#if defined UFSD_HASH_VAL_H && !defined UFSD_DISABLE_CONF_CHECK
  seq_printf( m, "Kernel .config hash: %s.\n", ufsd_hash_check_result );
#endif

#ifdef UFSD_DEBUG_ALLOC
  {
    size_t Mb = UsedMemMax/(1024*1024);
    size_t Kb = (UsedMemMax%(1024*1024)) / 1024;
    if ( Mb ) {
      seq_printf( m, "Memory report: Peak usage %zu.%03zu Mb (%zu bytes), kmalloc %zu, vmalloc %zu\n",
                  Mb, Kb, UsedMemMax, TotalKmallocs, TotalVmallocs );
    } else {
      seq_printf( m, "Memory report: Peak usage %zu.%03zu Kb (%zu bytes), kmalloc %zu, vmalloc %zu\n",
                  Kb, UsedMemMax%1024, UsedMemMax, TotalKmallocs, TotalVmallocs );
    }
    seq_printf( m, "Total allocated:  %zu bytes in %zu blocks, Max request %zu bytes\n",
                  TotalAllocs, TotalAllocBlocks, MemMaxRequest );
  }
#endif

  return 0;
}

static int ufsd_proc_dev_version_open( struct inode *inode, struct file *file )
{
  return single_open( file, ufsd_proc_dev_version_show, NULL );
}

static const struct proc_ops ufsd_proc_dev_version_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_version_open,
};

#define PROC_OPTIONS_MAX_LENGTH 128

static struct mutex   s_OptionsMutex;
static char ufsd_proc_mount_options[PROC_OPTIONS_MAX_LENGTH]
#ifdef DEFAULT_MOUNT_OPTIONS
     = DEFAULT_MOUNT_OPTIONS
#endif
    ;

///////////////////////////////////////////////////////////
// ufsd_proc_dev_options_show
//
// /proc/fs/ufsd/options
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_options_show(
    IN struct seq_file  *m,
    IN void             *o
    )
{
  mutex_lock( &s_OptionsMutex );
  seq_printf( m, "%s\n", ufsd_proc_mount_options );
  mutex_unlock( &s_OptionsMutex );
  return 0;
}


static int ufsd_proc_dev_options_open(struct inode *inode, struct file *file)
{
  return single_open( file, ufsd_proc_dev_options_show, NULL );
}


///////////////////////////////////////////////////////////
// ufsd_proc_dev_options_write
//
// /proc/fs/ufsd/options
///////////////////////////////////////////////////////////
static ssize_t
ufsd_proc_dev_options_write(
    IN struct file  *file,
    IN const char __user *buffer,
    IN size_t       count,
    IN OUT loff_t   *ppos
    )
{
  size_t len = min_t( size_t, count, PROC_OPTIONS_MAX_LENGTH - 1 );
  ssize_t ret;

  mutex_lock( &s_OptionsMutex );
  if ( *ppos ) {
    ret = -EINVAL;
  } else if ( copy_from_user( ufsd_proc_mount_options, buffer, len ) ) {
    ret = -EINVAL;
//    ufsd_proc_mount_options[0] = 0; // ?
  } else {
    while( len > 0 && '\n' == ufsd_proc_mount_options[len-1] )
      len -= 1;
    ufsd_proc_mount_options[len] = 0; // always set last zero
    *ppos = count;
    ret   = count;// always return required
  }
  mutex_unlock( &s_OptionsMutex );

  return ret;
}


const struct proc_ops ufsd_proc_dev_options_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_options_open,
  .proc_write    = ufsd_proc_dev_options_write,
};


///////////////////////////////////////////////////////////
// ufsd_proc_dev_dirty_show
//
// /proc/fs/ufsd/<dev>/dirty
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_dirty_show(
    IN struct seq_file  *m,
    IN void             *o
    )
{
  struct super_block *sb = m->private;
  seq_printf( m, "%u\n", (unsigned)UFSD_SB( sb )->bdirty );
  return 0;
}

static int ufsd_proc_dev_dirty_open( struct inode *inode, struct file *file )
{
  return single_open( file, ufsd_proc_dev_dirty_show, pde_data(inode) );
}

static const struct proc_ops ufsd_proc_dev_dirty_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_dirty_open,
};


///////////////////////////////////////////////////////////
// ufsd_proc_dev_volinfo
//
// /proc/fs/ufsd/<dev>/volinfo
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_volinfo(
    IN struct seq_file  *m,
    IN void             *o
    )
{
  usuper *sbi = UFSD_SB( (struct super_block*)(m->private) );

  //
  // Call UFSD library
  //
  lock_ufsd( sbi );

  // int seq_printf() becomes void in 4.3+
  ufsdapi_trace_volume_info( sbi->ufsd, m, (SEQ_PRINTF)&seq_printf );

  unlock_ufsd( sbi );
  return 0;
}

static int ufsd_proc_dev_volinfo_open(struct inode *inode, struct file *file)
{
  return single_open( file, ufsd_proc_dev_volinfo, pde_data(inode) );
}

static const struct proc_ops ufsd_proc_dev_volinfo_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_volinfo_open,
};


///////////////////////////////////////////////////////////
// ufsd_proc_dev_label_show
//
// /proc/fs/ufsd/<dev>/label
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_label_show(
    OUT struct seq_file *m,
    IN void             *o
    )
{
  usuper *sbi = UFSD_SB( (struct super_block*)(m->private) );
  unsigned char *Label = kmalloc( PAGE_SIZE, GFP_NOFS );
  if ( !Label )
    return -ENOMEM;

  //
  // Call UFSD library
  //
  lock_ufsd( sbi );

  ufsdapi_query_volume_info( sbi->ufsd, NULL, Label, PAGE_SIZE, NULL );
  Label[PAGE_SIZE-1] = 0;

  unlock_ufsd( sbi );

  DebugTrace( 0, Dbg, ("read_label: %s", Label ) );

  seq_printf( m, "%s\n", Label );

  kfree( Label );
  return 0;
}

static int ufsd_proc_dev_label_open( struct inode *inode, struct file *file )
{
  return single_open( file, ufsd_proc_dev_label_show, pde_data(inode) );
}


///////////////////////////////////////////////////////////
// ufsd_proc_dev_label_write
//
// /proc/fs/ufsd/<dev>/label
///////////////////////////////////////////////////////////
static ssize_t
ufsd_proc_dev_label_write(
    IN struct file  *file,
    IN const char __user *buffer,
    IN size_t       count,
    IN OUT loff_t   *ppos
    )
{
  struct super_block *sb = pde_data( file_inode( file ) );
  usuper *sbi = UFSD_SB( sb );
  // Always allocate additional byte for zero
  ssize_t allocate = (count + 1) < PAGE_SIZE ? (count + 1) : PAGE_SIZE;
  ssize_t ret = allocate - 1;
  char *Label = kmalloc( allocate, GFP_NOFS );
  if ( !Label )
    return -ENOMEM;

  if ( copy_from_user( Label, buffer, ret ) ) {
    ret = -EFAULT;
  } else {
    // Remove last '\n'
    while( ret > 0 && '\n' == Label[ret-1] )
      ret -= 1;
    // Set last zero
    Label[ret] = 0;

    DebugTrace( 0, Dbg, ("write_label: %s", Label ) );

    //
    // Call UFSD library
    //
    lock_ufsd( sbi );

    ret = ufsdapi_set_volume_info( sbi->ufsd, Label, ret );

    unlock_ufsd( sbi );

    if ( !ret ) {
      ret   = count; // Ok
      *ppos += count;
    } else {
      DebugTrace( 0, UFSD_LEVEL_ERROR, ("write_label failed: %x", (unsigned)ret ) );
      ret = -EINVAL;
    }
  }
  kfree( Label );
  return ret;
}

static const struct proc_ops ufsd_proc_dev_label_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_label_open,
  .proc_write    = ufsd_proc_dev_label_write,
};


///////////////////////////////////////////////////////////
// ufsd_proc_dev_noacsr_show
//
// /proc/fs/ufsd/<dev>/noacsr
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_noacsr_show(
    OUT struct seq_file *m,
    IN void             *o
    )
{
  usuper *sbi = UFSD_SB( (struct super_block*)(m->private) );
  char no_acs_rules = sbi->options.no_acs_rules;

  DebugTrace( 0, Dbg, ("read_noacsr: %d", no_acs_rules ) );

  seq_printf( m, "%d\n", no_acs_rules );

  return 0;
}


static int ufsd_proc_dev_noacsr_open( struct inode *inode, struct file *file )
{
  return single_open( file, ufsd_proc_dev_noacsr_show, pde_data(inode) );
}


///////////////////////////////////////////////////////////
// ufsd_proc_dev_noacsr_write
//
// /proc/fs/ufsd/<dev>/noacsr
///////////////////////////////////////////////////////////
static ssize_t
ufsd_proc_dev_noacsr_write(
    IN struct file  *file,
    IN const char __user *buffer,
    IN size_t       count,
    IN OUT loff_t   *ppos
    )
{
  char state_changed = 0;
  struct super_block *sb = pde_data( file_inode( file ) );
  usuper *sbi = UFSD_SB( sb );
  ssize_t ret = count < PAGE_SIZE? count : PAGE_SIZE;
  char *no_acs_rules = kmalloc( ret, GFP_NOFS );
  if ( !no_acs_rules )
    return -ENOMEM;

  if ( copy_from_user( no_acs_rules, buffer, ret ) ) {
    ret = -EFAULT;
  } else {
    if ( ( no_acs_rules[ 0 ] == '0' ) && ( sbi->options.no_acs_rules == 1 ) ) {
      // First symbol is '0' and option enabled - disable it
      sbi->options.no_acs_rules = 0;
      state_changed = 1;
    } else if ( ( no_acs_rules[ 0 ] != '0' ) && ( sbi->options.no_acs_rules == 0 ) ) {
      // First symbol isn't '0' and option disabled - enable it
      sbi->options.no_acs_rules = 1;
      state_changed = 1;
    }

    if ( state_changed ) {
      // Clear dentry cache for partition
      shrink_dcache_sb( sb );
      DebugTrace( 0, Dbg, ("write_noacsr: %d", sbi->options.no_acs_rules ) );
    }

    ret   = count; // Ok
    *ppos += count;
  }

  kfree( no_acs_rules );
  return ret;
}


static const struct proc_ops ufsd_proc_dev_noacsr_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_noacsr_open,
  .proc_write    = ufsd_proc_dev_noacsr_write,
};

#ifdef UFSD_DEBUG
static int ufsd_proc_dev_eject_open( struct inode *inode, struct file *file )
{
  return single_open( file, NULL, pde_data(inode) );
}


///////////////////////////////////////////////////////////
// ufsd_proc_dev_eject_write
//
// /proc/fs/ufsd/<dev>/eject
///////////////////////////////////////////////////////////
static ssize_t
ufsd_proc_dev_eject_write(
    IN struct file  *file,
    IN const char __user *buffer,
    IN size_t       count,
    IN OUT loff_t   *ppos
    )
{
  struct super_block *sb = pde_data( file_inode( file ) );
  usuper *sbi = UFSD_SB( sb );
  sbi->eject = 1;
  ufsd_printk( sb, "ejected" );

  return 1;
}

static const struct proc_ops ufsd_proc_dev_eject_fops = {
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_eject_open,
  .proc_write    = ufsd_proc_dev_eject_write,
};
#endif // #ifdef UFSD_DEBUG


typedef struct {
  const char   name[8];
  const struct proc_ops *fops;
  unsigned int mode;
} ufsd_proc_entries;

C_ASSERT( 0644 == ( S_IRUGO | S_IWUSR) );
static const ufsd_proc_entries ProcInfoEntries[] = {
  { "dirty",    &ufsd_proc_dev_dirty_fops   , S_IRUGO },
  { "label",    &ufsd_proc_dev_label_fops   , S_IRUGO | S_IWUSR },
  { "volinfo",  &ufsd_proc_dev_volinfo_fops , S_IRUGO },
  { "noacsr",   &ufsd_proc_dev_noacsr_fops  , S_IRUGO | S_IWUSR },
#ifdef UFSD_DEBUG
  { "eject",    &ufsd_proc_dev_eject_fops   , S_IWUSR },
#endif
};

static const ufsd_proc_entries ProcRootEntries[] = {
  { "version",  &ufsd_proc_dev_version_fops , S_IRUGO },
  { "options",  &ufsd_proc_dev_options_fops , S_IRUGO | S_IWUSR },
#ifdef UFSD_TRACE
  { "trace",    &ufsd_proc_dev_trace_fops   , S_IRUGO | S_IWUSR },
#ifndef UFSD_ANDROID_KMI_DENIED
  { "log",      &ufsd_proc_dev_log_fops     , S_IRUGO | S_IWUSR },
  { "cycle",    &ufsd_proc_dev_cycle_fops   , S_IRUGO | S_IWUSR },
#endif
#endif
};


///////////////////////////////////////////////////////////
// create_proc_entries
//
//
///////////////////////////////////////////////////////////
static const char*
create_proc_entries(
    IN const ufsd_proc_entries  *e,
    IN unsigned int             count,
    IN struct proc_dir_entry    *parent,
    IN void                     *data
    )
{
  for ( ; count--; e++ ) {
    if ( !proc_create_data( e->name, e->mode, parent, e->fops, data ) )
      return e->name;
  }
  return NULL;
}


///////////////////////////////////////////////////////////
// remove_proc_entries
//
//
///////////////////////////////////////////////////////////
static void
remove_proc_entries(
    IN const ufsd_proc_entries  *e,
    IN unsigned int             count,
    IN struct proc_dir_entry    *parent
    )
{
  for ( ; count--; e++ )
    remove_proc_entry( e->name, parent );
}


///////////////////////////////////////////////////////////
// ufsd_proc_info_create
//
// creates /proc/fs/ufsd/<dev>
// Called from 'ufsd_fill_super'
///////////////////////////////////////////////////////////
static void
ufsd_proc_info_create(
    IN struct super_block *sb
    )
{
  if ( proc_info_root ) {
    struct proc_dir_entry *e = proc_mkdir( sb->s_id, proc_info_root );
    const char *hint  = e? create_proc_entries( ProcInfoEntries, ARRAY_SIZE( ProcInfoEntries ), e, sb ) : "";
    if ( hint )
      printk( KERN_NOTICE QUOTED_UFSD_DEVICE": cannot create /proc/"PROC_FS_UFSD_NAME"/%s/%s\n", sb->s_id, hint );
    UFSD_SB( sb )->procdir = e;
  }
}


///////////////////////////////////////////////////////////
// ufsd_proc_info_delete
//
// deletes /proc/fs/ufsd/<dev>
// Called from 'ufsd_put_super'
///////////////////////////////////////////////////////////
static void
ufsd_proc_info_delete(
    IN struct super_block *sb
    )
{
  usuper *sbi = UFSD_SB( sb );

  if ( sbi->procdir )
    remove_proc_entries( ProcInfoEntries, ARRAY_SIZE( ProcInfoEntries ), sbi->procdir );

  if ( proc_info_root )
    remove_proc_entry( sb->s_id, proc_info_root );
  sbi->procdir = NULL;
}


///////////////////////////////////////////////////////////
// ufsd_proc_create
//
// creates "/proc/fs/ufsd"
// Called from 'ufsd_init'
///////////////////////////////////////////////////////////
static void
ufsd_proc_create( void )
{
  struct proc_dir_entry *e = proc_mkdir( PROC_FS_UFSD_NAME, NULL );
  const char *hint = e? create_proc_entries( ProcRootEntries, ARRAY_SIZE( ProcRootEntries), e, NULL ) : "";
  if ( hint )
    printk( KERN_NOTICE QUOTED_UFSD_DEVICE": cannot create /proc/"PROC_FS_UFSD_NAME"/%s\n", hint );
  proc_info_root = e;

  mutex_init( &s_OptionsMutex );
}


///////////////////////////////////////////////////////////
// ufsd_proc_delete
//
// deletes "/proc/fs/ufsd"
// Called from 'ufsd_exit'
///////////////////////////////////////////////////////////
static void
ufsd_proc_delete( void )
{
  if ( proc_info_root ) {
    remove_proc_entries( ProcRootEntries, ARRAY_SIZE( ProcRootEntries), proc_info_root );
    proc_info_root = NULL;
    remove_proc_entry( PROC_FS_UFSD_NAME, NULL );
  }
  mutex_destroy( &s_OptionsMutex );
}

#else

  #define ufsd_proc_info_create( s )
  #define ufsd_proc_info_delete( s )
  #define ufsd_proc_create()
  #define ufsd_proc_delete()

#endif // #if defined CONFIG_PROC_FS


///////////////////////////////////////////////////////////
// ufsd_put_super
//
// super_operations::put_super
// Drop the volume handle.
///////////////////////////////////////////////////////////
static void
ufsd_put_super(
    IN struct super_block *sb
    )
{
  usuper *sbi = UFSD_SB( sb );
  VfsTrace( +1, Dbg, ("put_super: \"%s\"", sb->s_id));

  //
  // Perform any delayed tasks
  //
  do_delayed_tasks( sbi );

  //
  // Stop flush thread
  //
#if UFSD_SMART_DIRTY_SEC
  write_lock( &sbi->state_lock );
  sbi->exit_flush_timer = 1;

  while ( sbi->flush_task ) {
    wake_up( &sbi->wait_exit_flush );
    write_unlock( &sbi->state_lock );
    wait_event( sbi->wait_done_flush, !sbi->flush_task );
    write_lock( &sbi->state_lock );
  }
  write_unlock( &sbi->state_lock );
#endif

  // Remove /proc/fs/ufsd/..
  ufsd_proc_info_delete( sb );

  ufsdapi_volume_umount( sbi->ufsd );

  ufsd_uload_nls( &sbi->options );

#ifdef UFSD_APFS
  if ( sbi->options.pass_array ) {
    size_t i;

    for (i = 0; i < MAX_APFS_VOLUMES; ++i)
      if ( sbi->options.pass_array[i] )
        kfree( sbi->options.pass_array[i] );

    kfree( sbi->options.pass_array );
    sbi->options.pass_array = NULL;
  }
#endif

#ifdef UFSD_USE_READ_WRITE
  if ( sbi->rw_buffer )
    vfree( sbi->rw_buffer );
#endif

  mutex_destroy( &sbi->api_mutex );

#ifdef UFSD_DEBUG
  if ( ufsd_trace_level & UFSD_LEVEL_ERROR ) {
    ufsd_trace( "Delayed: %zu + %zu\n", sbi->nDelClear, sbi->nDelWrite );
    if ( sbi->nReadBlocks )
      ufsd_trace( "Read %zu, hit %zu, Written %zu\n", sbi->nReadBlocks, sbi->nBufHit, sbi->nWrittenBlocks );
    if ( sbi->nReadBlocksNa )
      ufsd_trace( "ReadNa %zu, WrittenNa %zu\n", sbi->nReadBlocksNa, sbi->nWrittenBlocksNa );
    if ( sbi->nMappedBh )
      ufsd_trace( "Mapped: %zu - %zu. Peek %zu\n", sbi->nMappedBh, sbi->nUnMappedBh, sbi->nPeakMappedBh );
    assert( sbi->nMappedBh == sbi->nUnMappedBh );
    if ( sbi->nCompareCalls )
      ufsd_trace( "ufsd_d_compare %zu/%zu\n", sbi->nCompareCalls, sbi->nCompareCallsUfsd );
    if ( sbi->nHashCalls )
      ufsd_trace("ufsd_d_hash %zu/%zu\n", sbi->nHashCalls, sbi->nHashCallsUfsd );
  }
#endif

#ifdef CONFIG_FS_POSIX_ACL
  if ( sbi->x_buffer )
    kfree( sbi->x_buffer );
#endif

  ufsd_heap_free( sbi );
  sb->s_fs_info = NULL;
  assert( !UFSD_SB( sb ) );

  sync_blockdev( sb->s_bdev );
  invalidate_bdev( sb->s_bdev );

  trace_mem_report( 0 );

  VfsTrace( -1, Dbg, ("put_super ->\n"));
}


///////////////////////////////////////////////////////////
// ufsd_write_inode
//
// super_operations::write_inode
///////////////////////////////////////////////////////////
static int
ufsd_write_inode(
    IN struct inode *i,
    IN struct writeback_control *wbc
    )
{
  int err     = 0;
  unode *u    = UFSD_U( i );
  usuper *sbi = UFSD_SB( i->i_sb );
  int sync    = wbc->sync_mode == WB_SYNC_ALL;
  DEBUG_ONLY( const char *hint; )

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  DebugTrace( +1, Dbg, ("write_inode: r=%lx, %s, s=%d, \"%s\"", i->i_ino, S_ISDIR( i->i_mode )? "dir" : "file", (int)wbc->sync_mode, current->comm));

  if ( unlikely( !u->ufile ) ) {
    DebugTrace( 0, Dbg, ("write_inode: no ufsd handle for this inode"));
    DEBUG_ONLY( hint = "no file"; )
//    err = -EBADF;
  } else if ( !sync && !inode_trylock( i ) ) {
//    mark_inode_dirty_sync( i );
    DEBUG_ONLY( hint = "file locked"; )
  } else {
    UINT64 allocated;
    const UINT64 *asize = NULL;
    if ( try_lock_ufsd( sbi ) ) {
      if ( likely( u->ufile ) ) {
        err = ufsdapi_file_flush( sbi->ufsd, u->ufile, sbi->fi, ufsd_update_ondisk( sbi, i, sbi->fi ),
                                  i, atomic_read( &i->i_writecount ) > 0, sync, &allocated );
        if ( !err && S_ISREG(i->i_mode) )
          asize = &allocated;
      }

      DEBUG_ONLY( hint = "ok"; )
      unlock_ufsd( sbi );
    } else {
      //
      // Add this inode to internal list to write later
      //
      delay_write_inode *dw = kmalloc( sizeof(delay_write_inode), GFP_NOFS | __GFP_ZERO );
      if ( !dw )
        err = -ENOMEM;
      else {
        dw->ia_valid  = ufsd_update_ondisk( sbi, i, &dw->fi );
        dw->ufile     = u->ufile;
        dw->sync      = sync;
        spin_lock( &sbi->ddt_lock );
        list_add( &dw->wlist, &sbi->write_list );
        spin_unlock( &sbi->ddt_lock );
        DEBUG_ONLY( sbi->nDelWrite += 1; )
      }
      DEBUG_ONLY( hint = "ufsd locked"; )
    }

    if ( !is_compressed( u ) )
      update_cached_size( sbi, u, i->i_size, asize );

    if ( !sync )
      inode_unlock( i );
  }

  DebugTrace( -1, Dbg, ("write_inode -> %s", hint));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_sync_volume
//
// super_operations::sync_fs
///////////////////////////////////////////////////////////
static int
ufsd_sync_volume(
    IN struct super_block *sb,
    IN int wait
    )
{
  usuper *sbi = UFSD_SB( sb );
  int err = 0;

  if ( unlikely( ufsd_forced_shutdown( sbi ) ) )
    return -EIO;

  VfsTrace( +1, Dbg, ("sync_volume: \"%s\"%s", sb->s_id, wait? ",w":""));

  sbi->bdirty = 0;

  SMART_TRACE_ONLY( printk( "<4>ufsd: sync_volume:+\n" ); )

  if ( try_lock_ufsd( sbi ) ) {
    err = ufsdapi_volume_flush( sbi->ufsd, wait );
    unlock_ufsd( sbi );
  } else {

    //
    // Do volume flush later
    //
    atomic_set( &sbi->VFlush, wait? 2 : 1 );
  }

  SMART_TRACE_ONLY( printk( "<4>ufsd: sync_volume:-\n" ); )

  VfsTrace( -1, Dbg, ("sync_volume -> %d", err));
  return err;
}


#if UFSD_SMART_DIRTY_SEC
///////////////////////////////////////////////////////////
// ufsd_add_timer
//
// Helper function to add timer UFSD_SMART_DIRTY_SEC after last dirty
///////////////////////////////////////////////////////////
static inline void
ufsd_add_timer(
    IN usuper       *sbi,
    IN unsigned int sec
    )
{
  mod_timer( &sbi->flush_timer, HZ + sbi->last_dirty + msecs_to_jiffies( sec * 1000 ) );
}


///////////////////////////////////////////////////////////
// flush_timer_fn
//
// Timer function
///////////////////////////////////////////////////////////
static void
flush_timer_fn(
    IN struct timer_list* data
    )
{
  usuper *sbi = from_timer(sbi, data, flush_timer);

  if ( !sbi->bdirty ) {
    // Do not wake up flush thread
  } else {
    long dj = jiffies - sbi->last_dirty;
    if ( dj <= 0 || jiffies_to_msecs( dj ) < UFSD_SMART_DIRTY_SEC * 1000 ) {
      // Do not wake up flush thread
      // Sleep for another period
      ufsd_add_timer( sbi, UFSD_SMART_DIRTY_SEC );
    } else if ( sbi->flush_task ) {
      //
      // Volume is dirty and there are no writes last UFSD_SMART_DIRTY_SEC
      // Wake up flush thread
      //
      wake_up_process( sbi->flush_task );
    }
  }
}


///////////////////////////////////////////////////////////
// ufsd_flush_thread
//
// 'dirty_writeback_interval'
///////////////////////////////////////////////////////////
static int
ufsd_flush_thread(
    IN void *arg
    )
{
  struct super_block *sb = arg;
  usuper *sbi = UFSD_SB( sb );
#ifdef UFSD_DEBUG
  unsigned long j0, j1, j_a = 0, j_s = 0, cnt = 0;
#endif

  // Record that the flush thread is running
  sbi->flush_task = current;

  //
  // Set up an interval timer which can be used to trigger a flush wakeup after the flush interval expires
  //
  timer_setup( &sbi->flush_timer, flush_timer_fn, 0 );

  wake_up( &sbi->wait_done_flush );

  set_freezable();

  //
  // And now, wait forever for flush wakeup events
  //
  write_lock( &sbi->state_lock );

  DEBUG_ONLY( j0 = jiffies; )

  for ( ;; ) {
    if ( sbi->exit_flush_timer ) {
      write_unlock( &sbi->state_lock );
      del_timer_sync( &sbi->flush_timer );
      sbi->flush_task = NULL;
      wake_up( &sbi->wait_done_flush );
      DebugTrace( 0, Dbg, ("flush_thread exiting: active %u, sleep %u, cycles %lu", jiffies_to_msecs( j_a ), jiffies_to_msecs( j_s ), cnt ));
      return 0;
    }

    if ( sbi->bdirty ) {
      long dj = jiffies - sbi->last_dirty;
      if ( dj <= 0 || jiffies_to_msecs( dj ) < UFSD_SMART_DIRTY_SEC * 1000 ) {
        ufsd_add_timer( sbi, UFSD_SMART_DIRTY_SEC );
        SMART_TRACE_ONLY( printk( KERN_WARNING QUOTED_UFSD_DEVICE": flush_thread: skip\n" ); )
      } else {
        DEBUG_ONLY( const char *hint;  )

        sbi->bdirty = 0;
        write_unlock( &sbi->state_lock );

        SMART_TRACE_ONLY( printk( KERN_WARNING QUOTED_UFSD_DEVICE": flush_thread:+\n" ); )
        DebugTrace( +1, Dbg, ("flush_thread: \"%s\"", sb->s_id));

        //
        // Sync user's data
        //
        if ( likely( down_read_trylock( &sb->s_umount ) ) ) {
          sync_inodes_sb( sb );
          up_read( &sb->s_umount );
        }

        if ( down_write_trylock( &sb->s_umount ) ) {
          if ( try_lock_ufsd( sbi ) ) {
            ufsdapi_volume_flush( sbi->ufsd, 1 );
            unlock_ufsd( sbi );
            DEBUG_ONLY( hint = "flushed"; )
          } else {
            //
            // Do volume flush later
            //
            atomic_set( &sbi->VFlush, 1 );
            DEBUG_ONLY( hint = "delay"; )
          }
          up_write( &sb->s_umount );
        } else {
          atomic_set( &sbi->VFlush, 1 );
          DEBUG_ONLY( hint = "delay"; )
        }
        SMART_TRACE_ONLY( printk( KERN_WARNING QUOTED_UFSD_DEVICE": flush_thread:-\n" ); )
        DebugTrace( -1, Dbg, ("flush_thread -> %s", hint));

        write_lock( &sbi->state_lock );
      }
    }

    wake_up( &sbi->wait_done_flush );

#ifdef UFSD_DEBUG
    cnt += 1;
    j1 = jiffies;
    j_a += j1 - j0;
    j0 = j1;
#endif

    if ( freezing( current ) ) {
      DebugTrace( 0, Dbg, ("now suspending flush_thread" ));
      write_unlock( &sbi->state_lock );
      try_to_freeze();
      write_lock( &sbi->state_lock );

    } else if ( !sbi->exit_flush_timer ) {

      DEFINE_WAIT( wait );
      prepare_to_wait( &sbi->wait_exit_flush, &wait, TASK_INTERRUPTIBLE );
      write_unlock( &sbi->state_lock );

      schedule();

#ifdef UFSD_DEBUG
      j1 = jiffies;
      j_s += j1 - j0;
      j0 = j1;
#endif

      write_lock( &sbi->state_lock );
      finish_wait( &sbi->wait_exit_flush, &wait );
    }
  }
}
#endif


///////////////////////////////////////////////////////////
// ufsd_on_set_dirty
//
// Callback function. Called when volume becomes dirty
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_on_set_dirty(
    IN struct super_block *sb
    )
{
  usuper *sbi = UFSD_SB( sb );

#if UFSD_SMART_DIRTY_SEC
  write_lock( &sbi->state_lock );
  sbi->last_dirty = jiffies;
  sbi->bdirty = 1;
  if ( sbi->flush_timer.function ) // check case when this function is called while mounting
    ufsd_add_timer( sbi, UFSD_SMART_DIRTY_SEC );
  write_unlock( &sbi->state_lock );

  DebugTrace( 0, Dbg, ("ufsd_on_set_dirty( %u )", jiffies_to_msecs(jiffies-StartJiffies) + UFSD_SMART_DIRTY_SEC * 1000 ));

#else

  sbi->bdirty = 1;

#endif
  assert( !sb_rdonly( sb ) );
}


#if (defined UFSD_REFS34 || defined UFSD_REFS3) && defined ufsd_new_work

struct ufsd_work{
  struct work_struct work;
  void* arg;
  void (*fn)( void* );
};


///////////////////////////////////////////////////////////
// ufsd_work_handler
//
//
///////////////////////////////////////////////////////////
static void
ufsd_work_handler(
    IN struct work_struct *work
    )
{
  struct ufsd_work* uw = container_of( work, struct ufsd_work, work );
  (*uw->fn)( uw->arg );
  kfree( uw );
}


///////////////////////////////////////////////////////////
// ufsd_new_work
//
// schedule a new work
///////////////////////////////////////////////////////////
void*
UFSDAPI_CALL
ufsd_new_work(
    IN struct super_block* sb,
    IN void*  arg,
    IN void (*fn)( void* )
    )
{
  struct ufsd_work* uw;
//  usuper *sbi = UFSD_SB( sb );

  DebugTrace( 0, Dbg, ("ufsd_new_work\n"));

//   if ( !sbi->workqueue )
//     sbi->workqueue = create_workqueue( "ufsd_work" );

//  if ( !sbi->workqueue || ( !( uw  = kmalloc( sizeof( struct ufsd_work ), GFP_NOFS ) ) ) ) {
  if ( !( uw  = kmalloc( sizeof( struct ufsd_work ), GFP_NOFS ) ) ) {
    (*fn)( arg );
    return NULL;
  }

  uw->arg = arg;
  uw->fn  = fn;
  INIT_WORK( &uw->work, ufsd_work_handler );
//  queue_work( sbi->workqueue, &uw->work );

  schedule_work( &uw->work );
  return uw;
}


///////////////////////////////////////////////////////////
// ufsd_wait_work
//
// Wait until all scheduled work done
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_wait_work(
    IN struct super_block* sb
    )
{
//  usuper *sbi = UFSD_SB( sb );
//  flush_workqueue( sbi->workqueue );
  flush_scheduled_work();

  DebugTrace( 0, Dbg, ("ufsd_wait_work\n"));
}

#endif


///////////////////////////////////////////////////////////
// ufsd_statfs
//
// super_operations::statfs
///////////////////////////////////////////////////////////
static int
ufsd_statfs(
    IN struct dentry    *de,
    OUT struct kstatfs  *buf
    )
{
  struct super_block *sb = de->d_sb;
  usuper *sbi = UFSD_SB( sb );
  ufsd_volume_info info;
  UINT64 free_clusters;
  _lock_ufsd( sbi, NULL );

  ufsdapi_query_volume_info( sbi->ufsd, &info, NULL, 0, &free_clusters );

  _unlock_ufsd( sbi, NULL );

  buf->f_type   = info.fs_signature;
  buf->f_bsize  = info.bytes_per_cluster;
  buf->f_blocks = info.total_clusters;
  buf->f_bfree  = free_clusters;
  buf->f_bavail = buf->f_bfree;
#if 1
  buf->f_files  = 0;
  buf->f_ffree  = 0;
#else
  buf->f_files  = info.total_files;
  buf->f_ffree  = info.free_files;
#endif
  buf->f_namelen= info.namelen;

//  DebugTrace( 0, Dbg, ("statfs -> free=%llx", free_clusters));

  return 0;
}

// Forward declaration
static const char*
ufsd_parse_options(
    IN usuper *sbi,
    IN char   *options,
    IN int    first_mount
    );


///////////////////////////////////////////////////////////
// ufsd_remount
//
// super_operations::remount_fs
///////////////////////////////////////////////////////////
static int
ufsd_remount(
    IN struct super_block *sb,
    IN int                *flags,
    IN char               *data
    )
{
  mount_options opts_saved;
  int err = -EINVAL;
  int NeedParse = data && data[0];
  int Ro = *flags & SB_RDONLY;
  ufsd_volume_info info;
  usuper *sbi = UFSD_SB( sb );
  C_ASSERT( sizeof(sbi->options) == sizeof(opts_saved) );

#ifdef UFSD_TRACE
  unsigned long new_ufsd_trace_level, prev_ufsd_trace_level;

  mutex_lock( &s_MountMutex );

  // Save current trace level
  new_ufsd_trace_level  = prev_ufsd_trace_level = ufsd_trace_level;
#endif
  memset( &opts_saved, 0, sizeof(opts_saved) ); // not necessary, just to suppress warning

  //
  // Call UFSD library
  //
  lock_ufsd( sbi );

  VfsTrace( +1, Dbg, ("remount \"%s\", %lx, options \"%s\"", sb->s_id, sb->s_flags, data ));

  if ( sb_rdonly( sb ) && !Ro && sbi->options.journal >= JOURNAL_STATUS_NEED_REPLAY ) {
    DebugTrace( 0, Dbg, ("remount \"%s\": ro -> rw + jnl", sb->s_id ));
    printk( KERN_WARNING QUOTED_UFSD_DEVICE ": Couldn't remount \"%s\" rw because journal is not replayed."
            " Please umount/remount instead\n", sb->s_id );
    NeedParse = 0;
    goto Exit;
  }

  if ( NeedParse ) {
    const char *parse_err;

    // Save current options
    memcpy( &opts_saved, &sbi->options, sizeof(opts_saved) );

    // Parse options passed in command 'mount'
    memset( &sbi->options, 0, offsetof( struct mount_options, journal ));

    parse_err = ufsd_parse_options( sbi, data, 1 );
    if ( parse_err ) {
      VfsTrace( 0, Dbg, ("remount: failed to remount \"%s\", bad options \"%s\"", sb->s_id, parse_err ));
      goto Exit;
    }

#ifdef UFSD_TRACE
    // Save new value of trace and restore previous until the end of this function
    new_ufsd_trace_level  = ufsd_trace_level;
    ufsd_trace_level      = prev_ufsd_trace_level;
#endif
  }

  *flags |= SB_NODIRATIME | (sbi->options.noatime? SB_NOATIME : 0);

  if ( !Ro ) {
    if ( ( ufsdapi_query_volume_info( sbi->ufsd, &info, NULL, 0, NULL ) || info.dirty )
      && !sbi->options.force ) {
      //
      printk( KERN_WARNING QUOTED_UFSD_DEVICE": \"%s\": volume is dirty and \"force\" flag is not set\n", sb->s_id );
      goto Exit;
    }

    if ( is_refs( sbi ) && THREAD_SIZE < UFSD_MIN_REFS_RW_STACK ) {
      printk( KERN_CRIT QUOTED_UFSD_DEVICE": \"%s\": Refs rw requires 16K+ kernel stack (THREAD_SIZE=%uK)\n", sb->s_id, (unsigned)(THREAD_SIZE >> 10) );
      goto Exit;
    }
  }

  err = ufsdapi_volume_remount( sbi->ufsd, &Ro, &sbi->options );
  if ( err ) {
    DebugTrace( 0, Dbg, ("remount: failed to remount \"%s\", ufsdapi_volume_remount failed %x", sb->s_id, (unsigned)err ));
    err = -EINVAL;
    goto Exit;
  }

  if ( NeedParse ) {
    // unload original nls
    ufsd_uload_nls( &opts_saved );
  }

  sb->s_d_op = sbi->options.use_dop? &ufsd_dop : NULL;

  if ( sbi->options.raKb )
    sb->s_bdi->ra_pages = sbi->options.raKb >> ( PAGE_SHIFT-10 );

  if ( Ro )
    sb->s_flags |= SB_RDONLY;
  else
    sb->s_flags &= ~SB_RDONLY;

  //
  // Save 'sync' flag
  //
  if ( FlagOn( sb->s_flags, SB_SYNCHRONOUS ) )
    sbi->options.sync = 1;

Exit:

  if ( err && NeedParse ) {
    // unload new nls
    ufsd_uload_nls( &sbi->options );
    // Restore original options
    memcpy( &sbi->options, &opts_saved, sizeof(opts_saved) );
  }

  unlock_ufsd( sbi );

  VfsTrace( -1, Dbg, ("remount -> %d", err ));

#ifdef UFSD_TRACE
  // Setup new trace level
  ufsd_trace_level = new_ufsd_trace_level;

  mutex_unlock( &s_MountMutex );
#endif

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_evict_inode
//
// super_operations::evict_inode
///////////////////////////////////////////////////////////
static void
ufsd_evict_inode(
    IN struct inode *i
    )
{
  usuper *sbi = UFSD_SB( i->i_sb );
  unode *u    = UFSD_U( i );
  TRACE_ONLY( const char *hint=""; )

  VfsTrace( +1, Dbg, ("evict_inode: r=%lx, h=%pK", i->i_ino, u->ufile ));

  //
  // wait pending io operations to be finished ( !u->ioend_count )
  //
  truncate_inode_pages( &i->i_data, 0 );

  clear_inode( i );

  if ( !sbi ) {
    TRACE_ONLY( hint="forgotten"; )
  } else {
    ufsd_file *file;
    spin_lock( &i->i_lock );
    file      = u->ufile;
    u->ufile  = NULL;
    spin_unlock( &i->i_lock );

    if ( !file ) {
      TRACE_ONLY( hint = " nofile"; )
    } else if ( try_lock_ufsd( sbi ) ) {
      ufsdapi_file_close( sbi->ufsd, file );
      unlock_ufsd( sbi );
      TRACE_ONLY( hint = " ok"; )
    } else {
      struct list_head *lh = (struct list_head*)Add2Ptr( file, usdapi_file_to_list_offset() );
      //
      // Add this inode to internal list to clear later
      //
      spin_lock( &sbi->ddt_lock );
      if ( S_ISDIR( i->i_mode ) ) {
        list_add_tail( lh, &sbi->clear_list );
      } else {
        list_add( lh, &sbi->clear_list );
      }
      DEBUG_ONLY( sbi->nDelClear += 1; )
      TRACE_ONLY( hint = " (d)"; )
      spin_unlock( &sbi->ddt_lock );
    }
  }

  VfsTrace( -1, Dbg, ("evict_inode ->%s", hint ) );
}


///////////////////////////////////////////////////////////
// ufsd_show_options
//
// super_operations::show_options
///////////////////////////////////////////////////////////
static int
ufsd_show_options(
    IN struct seq_file  *seq,
    IN struct dentry    *dnt
    )
{
  usuper *sbi = UFSD_SB( dnt->d_sb );

  mount_options *opts = &sbi->options;

#ifdef UFSD_USE_NLS
  if ( opts->nls )
    seq_printf( seq, ",nls=%s", opts->nls->charset );
  else
    seq_printf( seq, ",nls=utf8" );
#endif

  if ( opts->uid )
    seq_printf( seq, ",uid=%d", opts->fs_uid );
  if ( opts->gid )
    seq_printf( seq, ",gid=%d", opts->fs_gid );
  if ( opts->fmask )
    seq_printf( seq, ",fmask=%o", (int)(unsigned short)~opts->fs_fmask );
  if ( opts->dmask )
    seq_printf( seq, ",dmask=%o", (int)(unsigned short)~opts->fs_dmask );
  if ( opts->showmeta )
    seq_printf( seq, ",showmeta" );
  if ( opts->sys_immutable )
    seq_printf( seq, ",sys_immutable" );
  if ( opts->nocase )
    seq_printf( seq, ",nocase" );
  if ( opts->noatime )
    seq_printf( seq, ",noatime" );
  if ( opts->bestcompr )
    seq_printf( seq, ",bestcompr" );
  if ( opts->sparse )
    seq_printf( seq, ",sparse" );
  if ( opts->force )
    seq_printf( seq, ",force" );
  if ( opts->nohidden )
    seq_printf( seq, ",nohidden" );
  if ( opts->acl )
    seq_printf( seq, ",acl" );
  if ( opts->wbMb_in_pages )
    seq_printf( seq, ",wb=%uM", opts->wbMb_in_pages >> LOG2OF_PAGES_PER_MB );
  else if ( opts->wb )
    seq_printf( seq, ",wb=%u", opts->wb );
  if ( opts->raKb ) {
    if ( opts->raKb&0x3ff )
      seq_printf( seq, ",ra=%u", opts->raKb );
    else
      seq_printf( seq, ",ra=%uM", opts->raKb>>10 );
  }
  if ( opts->eblockKb ) {
    if ( opts->eblockKb&0x3ff )
      seq_printf( seq, ",erase_block=%u", opts->eblockKb );
    else
      seq_printf( seq, ",erase_block=%uM", opts->eblockKb>>10 );
  }
  if ( opts->discard )
    seq_printf( seq, ",discard" );
  if ( UFSD_SAFE_ORDER == opts->safe )
    seq_printf( seq, ",safe=order" );
  else if ( UFSD_SAFE_JNL == opts->safe )
    seq_printf( seq, ",safe=jnl" );
  if ( opts->no_acs_rules )
    seq_printf( seq, ",no_acs_rules" );
  if ( opts->fast_mount )
    seq_printf( seq, ",fast_mount" );
  if ( opts->localtime )
    seq_printf( seq, ",localtime" );
  if ( opts->showdots )
    seq_printf( seq, ",showdots" );

  return 0;
}

///////////////////////////////////////////////////////////
// ufsd_shutdown
//
// super_operations::shutdown
///////////////////////////////////////////////////////////
static void ufsd_shutdown(struct super_block *sb)
{
  usuper *sbi = UFSD_SB( sb );
  assert(0);
  DebugTrace( 0, Dbg, ("shutdown(\"%s\"):", sb->s_id));
  set_bit( UFSD_SBI_FLAGS_SHUTDOWN_BIT, &sbi->flags );
}


//
// Volume operations
// super_block::s_op
//
static const struct super_operations ufsd_sops = {
  .alloc_inode    = ufsd_alloc_inode,
  .destroy_inode  = ufsd_destroy_inode,
  .put_super      = ufsd_put_super,
  .statfs         = ufsd_statfs,
  .remount_fs     = ufsd_remount,
  .sync_fs        = ufsd_sync_volume,
  .write_inode    = ufsd_write_inode,
  .evict_inode    = ufsd_evict_inode,
  .show_options   = ufsd_show_options,
  .shutdown       = ufsd_shutdown,
};


///////////////////////////////////////////////////////////
// ufsd_get_name
//
// dentry - the directory in which to find a name
// name   - a pointer to a %NAME_MAX+1 char buffer to store the name
// child  - the dentry for the child directory.
//
//
// Get the name of child entry by its ino
// export_operations::get_name
///////////////////////////////////////////////////////////
static int
ufsd_get_name(
    IN struct dentry  *de,
    OUT char          *name,
    IN struct dentry  *ch
    )
{
  int err;
  struct inode *i_p   = de->d_inode;
  struct inode *i_ch  = ch->d_inode;
  usuper *sbi = UFSD_SB( i_ch->i_sb );

  DebugTrace( +1, Dbg, ("get_name: r=%lx=%pK('%.*s'), r=%lx=%pK('%.*s')",
              i_p->i_ino, de, (int)de->d_name.len, de->d_name.name,
              i_ch->i_ino, ch, (int)ch->d_name.len, ch->d_name.name ));

  //
  // Reset returned value
  //
  name[0] = 0;

  //
  // Call UFSD
  //
  lock_ufsd( sbi );

  err = ufsdapi_file_get_name( sbi->ufsd, UFSD_FH(i_ch), i_p->i_ino, name, NAME_MAX )
     ? -ENOENT
     : 0;

  unlock_ufsd( sbi );

  DebugTrace( -1, Dbg, ("get_name -> %d (%s)", err, name ));
  return err;
}


///////////////////////////////////////////////////////////
// ufsd_get_parent
//
// export_operations::get_parent
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_get_parent(
    IN struct dentry *de
    )
{
  ufsd_iget5_param param;
  struct inode *i = de->d_inode;
  usuper *sbi     = UFSD_SB( i->i_sb );

  DebugTrace( +1, Dbg, ("get_parent: r=%lx, h=%pK, ('%.*s')", i->i_ino, UFSD_FH(i), (int)de->d_name.len, de->d_name.name));

  param.subdir_count = 0;

  //
  // Call UFSD library
  //
  lock_ufsd( sbi );

  if ( !ufsd_open_by_id( sbi, i )
    && !ufsdapi_file_get_parent( sbi->ufsd, UFSD_FH(i), &param.fh, &param.fi ) ) {

    assert( param.fh );
    param.Create = NULL;
    i = iget5( i->i_sb, &param );

    // Close ufsd handle if it was not used
    if ( unlikely( param.fh ) )
      ufsdapi_file_close( sbi->ufsd, param.fh );

    if ( unlikely( !i ) )
      i = ERR_PTR( -ENOMEM );

  } else {
    i = ERR_PTR( -ENOENT ); // No parent for given inode
  }

  unlock_ufsd( sbi );

  // Finally get a dentry for the parent directory and return it.
  // d_obtain_alias accepts NULL and error pointers
  de = d_obtain_alias( i );

  if ( likely( !IS_ERR( de ) ) ) {
    DebugTrace( -1, Dbg, ("get_parent -> ('%.*s'), r=%lx, l=%x",
                (int)de->d_name.len, de->d_name.name, i->i_ino, i->i_nlink ));
  } else {
    DebugTrace( -1, Dbg, ("get_parent -> failed %ld", PTR_ERR( de ) ));
  }
  return de;
}


#ifdef UFSD_USE_ENCODE_FH
///////////////////////////////////////////////////////////
// ufsd_encode_fh
//
// stores in the file handle fragment 'fh' (using at most 'max_len' bytes)
// information that can be used by 'decode_fh' to recover the file refered
// to by the 'struct dentry* de'
//
// export_operations::encode_fh
///////////////////////////////////////////////////////////
static int
ufsd_encode_fh(
    IN struct inode   *i,
    IN __u32          *fh,
    IN OUT int        *max_len,
    IN struct inode   *connectable
    )
{
  int type;
  usuper *sbi;

  DebugTrace( +1, Dbg, ("encode_fh: r=%lx, %x", i->i_ino, *max_len ));

  sbi = UFSD_SB( i->i_sb );

  lock_ufsd( sbi );

  type = ufsdapi_encode_fh( sbi->ufsd, UFSD_FH(i), fh, max_len )
    ? 0xff
    : 3;

  unlock_ufsd( sbi );

  DebugTrace( -1, Dbg, ("encode_fh -> %d, %x", type, *max_len) );

  return type;
}


///////////////////////////////////////////////////////////
// ufsd_decode_fh
//
// Helper function for export (inverse function to ufsd_encode_fh)
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_decode_fh(
    IN struct super_block *sb,
    IN const void   *fh,
    IN unsigned     fh_len,
    IN int          parent,
    IN const char   *func
    )
{
  usuper *sbi     = UFSD_SB( sb );
  ufsd_iget5_param param;
  struct inode *i;
  struct dentry *de;
  int err;

  DebugTrace( +1, Dbg, ("%s: \"%s\" %x,%d", func, sb->s_id, fh_len, parent ));

  //
  // Call UFSD library
  //
  lock_ufsd( sbi );

  err = ufsdapi_decode_fh( sbi->ufsd, fh, fh_len, parent, &param.fh, &param.fi );
  if ( err  )
    i = ERR_PTR( -ESTALE == err? -ESTALE : -ENOENT );
  else {
    param.Create = NULL;
    i = iget5( sb, &param );

    // Close ufsd handle if it was not used
    if ( unlikely( param.fh ) )
      ufsdapi_file_close( sbi->ufsd, param.fh );

    if ( unlikely( !i ) )
      i = ERR_PTR( -ENOMEM );
  }

  unlock_ufsd( sbi );

  // d_obtain_alias accepts NULL and error pointers
  de = d_obtain_alias( i );

  if ( likely( !IS_ERR( de ) ) ) {
    DebugTrace( -1, Dbg, ("%s: -> ('%.*s'), r=%lx, h=%pK l=%x m=%o",
                func, (int)de->d_name.len, de->d_name.name,
                i->i_ino, UFSD_FH(i), i->i_nlink, i->i_mode ));
  } else {
    DebugTrace( -1, Dbg, ("%s: -> failed %ld", func, PTR_ERR( de ) ));
  }

  return de;
}


///////////////////////////////////////////////////////////
// ufsd_decode_fh_to_dentry
//
// encode_export_operations::fh_to_dentry
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_decode_fh_to_dentry(
    IN struct super_block *sb,
    IN struct fid *fid,
    IN int fh_len,
    IN int fh_type
    )
{
  return 3 != fh_type? ERR_PTR( -ENOENT ) : ufsd_decode_fh( sb, fid, fh_len, 0, "fh_to_dentry" );
}


///////////////////////////////////////////////////////////
// ufsd_decode_fh_to_parent
//
// encode_export_operations::fh_to_parent
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_decode_fh_to_parent(
    IN struct super_block *sb,
    IN struct fid *fid,
    IN int fh_len,
    IN int fh_type
    )
{
  return 3 != fh_type? ERR_PTR( -ENOENT ) : ufsd_decode_fh( sb, fid, fh_len, 1, "fh_to_parent" );
}


//
// NFS operations.
// super_block::s_export_op
//
static const struct export_operations ufsd_encode_export_op = {
  .encode_fh    = ufsd_encode_fh,
  .get_name     = ufsd_get_name,
  .get_parent   = ufsd_get_parent,
  .fh_to_dentry = ufsd_decode_fh_to_dentry,
  .fh_to_parent = ufsd_decode_fh_to_parent,
};
#endif // #ifdef UFSD_USE_ENCODE_FH


#ifdef UFSD_USE_ID
///////////////////////////////////////////////////////////
// ufsd_nfs_get_inode
//
// Helper function for export
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_nfs_get_inode(
    IN struct super_block *sb,
    IN u64        ino,
    IN u32        gen,
    IN const char *func
    )
{
  struct dentry *de;
  struct inode *i;

  DebugTrace( +1, Dbg, ("%s: \"%s\" r=%llx,%u", func, sb->s_id, ino, gen ));

  // Do fast search first
  i = ilookup( sb, ino );

  if ( !i ) {
    ufsd_iget5_param param;
    usuper *sbi = UFSD_SB( sb );

    //
    // Call UFSD library
    //
    lock_ufsd( sbi );

    if ( ufsdapi_file_open_by_id( sbi->ufsd, ino, &param.fh, &param.fi ) ) {
      i = ERR_PTR( -ENOENT );
    } else {
      // need to close param.fh if not used
      assert( param.fh );
      param.Create = NULL;
      i = iget5( sb, &param );

      // Close ufsd handle if it was not used
      if ( unlikely( param.fh ) )
        ufsdapi_file_close( sbi->ufsd, param.fh );

      if ( !i )
        i = ERR_PTR( -ENOMEM );
    }

    unlock_ufsd( sbi );
  }

  if ( !IS_ERR( i ) && i->i_generation != gen ) {
    // we didn't find the right inode...
    DebugTrace( 0, UFSD_LEVEL_ERROR, ("**** %s: -> stale (%x != %x)", func, i->i_generation, gen ));
    iput( i );
    i = ERR_PTR( -ESTALE );
  }

  // d_obtain_alias accepts NULL and error pointers
  de = d_obtain_alias( i );

  if ( likely( !IS_ERR( de ) ) ) {
    DebugTrace( -1, Dbg, ("%s: -> ('%.*s'), r=%lx, l=%x m=%o",
                         func, (int)de->d_name.len, de->d_name.name,
                         i->i_ino, i->i_nlink, i->i_mode ));
  } else {
    DebugTrace( -1, Dbg, ("%s: -> failed %ld", func, PTR_ERR( de ) ));
  }

  return de;
}


///////////////////////////////////////////////////////////
// ufsd_fh_to_dentry
//
// export_operations::fh_to_dentry
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_fh_to_dentry(
    IN struct super_block *sb,
    IN struct fid *fid,
    IN int fh_len,
    IN int fh_type
    )
{
  assert( 2 == fh_len || 4 == fh_len );
  return
    fh_len >= 2 && ( FILEID_INO32_GEN == fh_type || FILEID_INO32_GEN_PARENT == fh_type )
    ? ufsd_nfs_get_inode( sb, fid->i32.ino, fid->i32.gen, "fh_to_dentry" )
    : NULL;
}


///////////////////////////////////////////////////////////
// ufsd_fh_to_parent
//
// export_operations::fh_to_parent
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_fh_to_parent(
    IN struct super_block *sb,
    IN struct fid *fid,
    IN int fh_len,
    IN int fh_type
    )
{
  assert( 2 == fh_len || 4 == fh_len );
  return
    fh_len >= 3 && FILEID_INO32_GEN_PARENT == fh_type
    ? ufsd_nfs_get_inode( sb, fid->i32.parent_ino, fh_len >= 4? fid->i32.parent_gen : 0, "fh_to_parent" )
    : NULL;
}


///////////////////////////////////////////////////////////
// ufsd_encode_fh_ino
//
// export_operations::encode_fh
///////////////////////////////////////////////////////////
static int
ufsd_encode_fh_ino(
    IN struct inode   *i,
    IN __u32          *fh,
    IN OUT int        *max_len,
    IN struct inode   *parent
    )
{
  struct fid *fid = (void *)fh;
  int len = *max_len;
  int type = FILEID_INO32_GEN;

  if (parent && (len < 4)) {
    *max_len = 4;
    return FILEID_INVALID;
  } else if (len < 2) {
    *max_len = 2;
    return FILEID_INVALID;
  }

  len = 2;
  fid->i32.ino = i->i_ino;
  fid->i32.gen = i->i_generation;
  if (parent) {
    fid->i32.parent_ino = parent->i_ino;
    fid->i32.parent_gen = parent->i_generation;
    len = 4;
    type = FILEID_INO32_GEN_PARENT;
  }
  *max_len = len;
  return type;
}


//
// NFS operations.
// super_block::s_export_op
//
static const struct export_operations ufsd_export_op = {
  /* NOTE: encode_fh is mandatory!*/
  .encode_fh    = ufsd_encode_fh_ino,
  .get_name     = ufsd_get_name, // TODO: remove (?)
  .get_parent   = ufsd_get_parent,
  .fh_to_dentry = ufsd_fh_to_dentry,
  .fh_to_parent = ufsd_fh_to_parent,
};
#endif // #ifdef UFSD_USE_ID


static const char s_Options[][16] = {
  "nocase",           // 0
  "uid",              // 1
  "gid",              // 2
  "umask",            // 3
  "fmask",            // 4
  "dmask",            // 5
  "trace",            // 6
  "log",              // 7
  "sys_immutable",    // 8
  "quiet",            // 9
  "noatime",          // 10
  "bestcompr",        // 11
  "showmeta",         // 12
  "nobuf",            // 13
  "sparse",           // 14
  "codepage",         // 15
  "nls",              // 16
  "iocharset",        // 17
  "force",            // 18
  "nohidden",         // 19
  "erase_block",      // 20
  "bias",             // 21
  "user_xattr",       // 22 - not used
  "acl",              // 23
  "chkcnv",           // 24
  "cycle",            // 25
  "delim",            // 26
  "nolazy",           // 27
  "nojnl",            // 28
  "wb",               // 29
  "ra",               // 30
  "discard",          // 31
  "safe",             // 32
  "no_acs_rules",     // 33
  "oemcodepage",      // 34
  "utf8",             // 35
  "fast_mount",       // 36
  "subvolumes",       // 37
  "localtime",        // 38
  "pass",             // 39
  "passfile",         // 40
  "history",          // 41
  "showdots",         // 42
  "windows_names",    // 43 - ignored for compatibility with udisks2 (src/udiskslinuxfilesystem.c: ntfs_defaults[])
};


///////////////////////////////////////////////////////////
// ufsd_parse_options_substring
//
// Parse options.
// Helper function for 'ufsd_parse_options'
// It fills mount_options *opts
// Returns NULL if ok
///////////////////////////////////////////////////////////
noinline static const char*
ufsd_parse_options_substring(
    IN mount_options *opts,
    IN char          *options,
    IN int            first_mount,
    OUT bool*         builtin_utf8
    )
{
  char *t,*v,*delim;
  const char *ret = NULL;
  int i;
  char c;
  unsigned long tmp;
#ifdef UFSD_USE_NLS
  char nls_name[30];
#if defined UFSD_FAT
  char nls_oem_name[30];
  nls_oem_name[0] = 0;
#endif
  nls_name[0] = 0;
  *builtin_utf8 = false;
#else
  *builtin_utf8 = true;
#endif

  while( ',' == *options )
    options += 1;

  while ( ( ( t = strsep( &options, "," ) ) ) ) {

    // Save current pointer to "=" delimiter
    // It will be used to restore current option
    v = delim = strchr( t, '=' );
    if ( v )
      *v++ = 0;

    for ( i = 0; i < ARRSIZE(s_Options) && strcmp( t, s_Options[i] ); i++ ) {
      ;
    }

    //Filtering options pass1, pass2, ..., pass100
    if ( i == ARRSIZE(s_Options) && !strncmp( t, s_Options[39], 4 ) )
      i = 39;          //Detailed checking this option below

    switch( i ) {
      case 0:   // "nocase"
      case 22:  // "user_xattr": cosmetic - disable "ignore option user_xattr" misunderstanding message
      case 23:  // "acl"
      case 28:  // "nojnl"
      case 31:  // "discard"
      case 33:  // "no_acs_rules"
      case 36:  // "fast_mount"
      case 42:  // "showdots"
        // Support both forms: 'nocase' and 'nocase=0/1'
        if ( !v || !v[0] ) {
          c = 1;  // parse short form "nocase"
        } else if ( !v[1] && '0' <= v[0] && v[0] <= '9' ) {
          c = (char)(v[0] - '0'); // parse wide form "nocase=X", where X=0,1,..,9
        } else {
          goto Err;
        }
        switch( i ) {
          case 0:   opts->nocase = c; break;
          case 23:  opts->acl = c; break;
          case 28:  opts->nojnl = c; break;
          case 31:  opts->discard = c; break;
          case 33:  opts->no_acs_rules = c; break;
          case 36:  opts->fast_mount = c; break;
          case 42:  opts->showdots  = c; break;
        }
        break;
      case 1:   // "uid"
      case 2:   // "gid"
      case 21:  // "bias"
        if ( !v || !v[0] ) goto Err;
        tmp = simple_strtol( v, &v, 0 );
        if ( v[0] ) goto Err;
        switch( i ) {
        case 1: opts->fs_uid = tmp; opts->uid = 1; break;
        case 2: opts->fs_gid = tmp; opts->gid = 1; break;
        case 21: opts->bias = tmp; break;
        }
        break;
      case 3: // "umask"
      case 4: // "fmask"
      case 5: // "dmask"
        if ( !v || !v[0] ) goto Err;
        tmp = ~simple_strtoul( v, &v, 8 );
        if ( v[0] ) goto Err;
        switch( i ) {
        case 3: opts->fs_fmask = opts->fs_dmask = tmp; opts->fmask = opts->dmask = 1; break;
        case 4: opts->fs_fmask = tmp; opts->fmask = 1; break;
        case 5: opts->fs_dmask = tmp; opts->dmask = 1; break;
        }
        break;
      case 20:  // "erase_block"
      case 30:  // "ra"
        if ( !v || !v[0] ) goto Err;
        tmp = simple_strtoul( v, &v, 0 );
        if ( !v[0] || 'K' == v[0] ) {
          ;
        } else if ( 'M' == *v ) {
          tmp *= 1024;
        } else {
          goto Err;
        }
        switch( i ) {
        case 20: opts->eblockKb = tmp; break;
        case 30: opts->raKb = tmp; break;
        }
        break;
      case 29:
        // Supported forms: 'wb', 'wb=...' and 'wb=..M'
        if ( !v || !v[0] ) {
          // Handling "wb" and "wb="
          opts->wb = 1;
        } else {
          // Handling "wb=..."
          tmp = simple_strtoul( v, &v, 0 );
          if ( v[0] == 'M' ) {
            // Check for overflow. note: tmp is 'unsigned long'
            if ( tmp < (UINT_MAX>>LOG2OF_PAGES_PER_MB) ) {
              opts->wbMb_in_pages = tmp << LOG2OF_PAGES_PER_MB;
            } else {
              goto Err;
            }
          } else {
            if ( v[0] ) goto Err;
            opts->wb = tmp;
          }
        }
        break;
#ifdef UFSD_TRACE
      case 6: // "trace"
        if ( first_mount ) {
          parse_trace_level( v );
        }
        break;
#ifndef UFSD_ANDROID_KMI_DENIED
      case 7: // "log"
        if ( !v ) goto Err;
        strncpy( ufsd_trace_file, v, sizeof(ufsd_trace_file) - 1 );
        ufsd_trace_file[sizeof(ufsd_trace_file)-1] = 0;
        ufsd_close_trace( 1 );
        break;
      case 25:  // "cycle"
        parse_cycle_value( v );
        break;
#endif
#endif
      case 8: // "sys_immutable"
        if ( v ) goto Err;
        opts->sys_immutable = 1;
        break;
      case 9: // "quiet"
        break;
      case 10: // "noatime"
        if ( v ) goto Err;
        opts->noatime = 1;
        break;
      case 11: // "bestcompr"
        if ( v ) goto Err;
        opts->bestcompr = 1;
        break;
      case 12: // "showmeta"
        if ( v ) goto Err;
        opts->showmeta = 1;
        break;
      case 13: // "nobuf"
        break;
      case 14: // "sparse"
        if ( v ) goto Err;
        opts->sparse = 1;
        break;
#ifdef UFSD_USE_NLS
      case 15: // "codepage"
        if ( !v || !v[0] ) goto Err;
        sprintf( nls_name, "cp%d", (int)simple_strtoul( v, &v, 0 ) );
        if ( v[0] ) goto Err;
        break;
      case 16: // "nls"
      case 17: // "iocharset"
        if ( !v || !v[0] ) goto Err;
        strncpy( nls_name, v, sizeof(nls_name) - 1 );
        break;
#endif
      case 18: // "force"
        if ( v ) goto Err;
        opts->force = 1;
        break;
      case 19: // "nohidden"
        if ( v ) goto Err;
        opts->nohidden = 1;
        break;
      case 24: // "chkcnv"
        if ( v ) goto Err;
        opts->chkcnv = 1;
        break;
#ifdef UFSD_USE_STREAM
      case 26:  // "delim=':'
        if ( !v || !v[0] ) {
          opts->delim = 0;
        } else if ( !v[1] ) {
          opts->delim = v[0];
        } else {
          goto Err;
        }
        break;
#endif
      case 32:  // "safe": safe={jnl,none,order}
        if ( !v || !strcmp( v, "jnl" ) )
          opts->safe = UFSD_SAFE_JNL;
        else if ( !strcmp( v, "order" ) )
          opts->safe = UFSD_SAFE_ORDER;
        else if ( !strcmp( v, "basic" ) )
          opts->safe = UFSD_SAFE_BASIC;
        else
          goto Err;
        break;

#if defined UFSD_FAT && defined UFSD_USE_NLS
      case 34:  // "oemcodepage"
        if ( !v || !v[0] ) goto Err;
        sprintf( nls_oem_name, "cp%d", (int)simple_strtoul( v, &v, 0 ) );
        if ( v[0] ) goto Err;
        break;
#endif
      case 35: // "utf8"
#ifdef UFSD_USE_NLS
        // Add build-in utf8
        nls_name[0] = 0;
#endif
        break;

#ifdef UFSD_EXFAT
      case 38: // "localtime"
        opts->localtime = 1;
        break;
#endif

#ifdef UFSD_APFS
      case 37: // "subvolumes"
        opts->subvolumes = 1;
        break;

      case 39:  // "pass"
      {
        int vol = simple_strtoul( t + 4, NULL, 0 ) - 1;
        unsigned int num_digits = 0;
        int tmp_vol;

        // passphrase could be empty
        size_t pass_len = v ? strlen( v ) : 0;

        if ( vol < 0 || vol >= MAX_APFS_VOLUMES ) {
          printk( KERN_WARNING QUOTED_UFSD_DEVICE": wrong subvolume number %d", vol );
          goto Err;
        }

        //Check symbols after volume number (for example "pass1a")
        for (tmp_vol = vol + 1; tmp_vol > 0; tmp_vol /= 10)
          num_digits++;
        if (strlen(s_Options[39]) + num_digits != strlen(t))
          goto Err;

        if ( pass_len > MAX_APFS_PASSPHRASE_LENGTH ) {
          printk( KERN_WARNING QUOTED_UFSD_DEVICE": subvolume %d passphrase length is greater than allowed (%d)", vol, MAX_APFS_PASSPHRASE_LENGTH );
          break;
        }

        if ( !opts->pass_array ) {
          opts->pass_array = (char**)kzalloc( MAX_APFS_VOLUMES * sizeof(char*), GFP_KERNEL );
          if ( !opts->pass_array )
            goto Err;
        }

        if ( opts->pass_array[vol] )
          kfree( opts->pass_array[vol] );
        opts->pass_array[vol] = (char*)kzalloc( pass_len + 1, GFP_KERNEL );

        if ( !opts->pass_array[vol] )
          goto Err;

        strncpy( opts->pass_array[vol], v, pass_len );
        break;
      }

#ifndef UFSD_ANDROID_KMI_DENIED
      case 40:  // "passfile"
      {
        struct file *f = filp_open(v, O_RDONLY, 0);
        if ( IS_ERR( f ) ) {
          printk(KERN_ALERT "Failed to open file %s!\n", v);
          goto Err;
        }
        // Read the file
        if ( !opts->pass_array )
          opts->pass_array = (char**)kzalloc( MAX_APFS_VOLUMES * sizeof(char*), GFP_KERNEL );

        if ( opts->pass_array )
          i = parse_pass_file(f, opts->pass_array);

        filp_close( f, NULL );

        if ( i )
          goto Err;
      }
      break;
#endif

      case 41:  // "history"
        if ( !v || !v[0] ) goto Err;
        opts->history = simple_strtoul( v, &v, 0 );
        if ( v[0] ) goto Err;
        break;
#endif

      case 43: // "windows_names"
        // Ignore option
        break;

      case ARRSIZE(s_Options):
Err:
        // Return error options
        ret = t;
        break;

      default:
        printk( KERN_WARNING QUOTED_UFSD_DEVICE": ignore option %s\n", t );

    } // switch ( i )

    // Restore options string
    if ( delim )
      delim[0] = '=';

    // Restore full string
    if ( options )
      options[-1] = ',';

    if ( ret )
      return ret; // error

  } // while ( options )

#ifdef UFSD_USE_NLS
  if ( nls_name[0] ) {
    assert( !opts->nls );
    opts->nls  = load_nls( nls_name );
    if ( !opts->nls ) {
      ufsd_printk( NULL, "Failed to load \"nls_%s\"\n", nls_name );
      return "failed to load nls";
    }
  } else {
    *builtin_utf8 = true;
  }

#if defined UFSD_FAT
  if ( nls_oem_name[0] ) {
    assert( !opts->nls_oem );
    opts->nls_oem = load_nls( nls_oem_name );
    if ( !opts->nls_oem ) {
      ufsd_printk( NULL, "Failed to load \"nls_%s\"\n", nls_oem_name );
      return "failed to load nls";
    }
  }
#endif

#endif

  return NULL;
}


///////////////////////////////////////////////////////////
// ufsd_parse_options
//
// Parse options.
// Helper function for 'fill_super'
// It fills sbi->options
// Returns NULL if ok
///////////////////////////////////////////////////////////
noinline static const char*
ufsd_parse_options(
    IN usuper *sbi,
    IN char   *options,
    IN int    first_mount
    )
{
  mount_options *opts = &sbi->options;
  const char *ret = NULL;
  bool builtin_utf8 = false;

  assert( !opts->nls );
  assert( current->fs );

  //
  // Setup default options
  //
  opts->fs_uid   = __kuid_val( current_uid() );
  opts->fs_gid   = __kgid_val( current_gid() );
  opts->fs_fmask = opts->fs_dmask = ~current_umask();
  opts->no_acs_rules = 0;
  opts->bias     = -1;
  opts->discard  = 0;
  opts->wbMb_in_pages = 0;
  opts->safe     = UFSD_SAFE_BASIC;
  opts->birthtime = 1;

#ifdef UFSD_APFS
  if ( opts->pass_array ) {
    size_t i;
    for (i = 0; i < MAX_APFS_VOLUMES; ++i)
      if ( opts->pass_array[i] )
        kfree( opts->pass_array[i] );
    kfree( opts->pass_array );
    opts->pass_array = NULL;
  }
  opts->history = 0;
#endif

  if ( options && options[0] ) {
    ret = ufsd_parse_options_substring( opts, options, first_mount, &builtin_utf8 );
    if ( ret )
      return ret;
  }

#if defined CONFIG_PROC_FS
  mutex_lock( &s_OptionsMutex );
  if ( ufsd_proc_mount_options[0] )
    ret = ufsd_parse_options_substring( opts, ufsd_proc_mount_options, first_mount, &builtin_utf8 );
  mutex_unlock( &s_OptionsMutex );
  if ( ret )
    return ret;
#endif

#ifdef UFSD_USE_NLS
  //
  // Load default nls if no nls related options
  //
  if ( !opts->nls && !builtin_utf8 ) {
    opts->nls = load_nls_default();
    if ( opts->nls ) {
      DebugTrace( 0, Dbg, ("Use default nls %s", opts->nls->charset ));
    } else {
      DebugTrace( 0, Dbg, ("Failed to load default nls" ));
    }
  }
#endif

  //
  // If no nls then use builtin utf8
  //
  if ( !opts->nls ) {
    DebugTrace( 0, Dbg, ("use builtin utf8" ));
  }

#ifndef CONFIG_FS_POSIX_ACL
  opts->acl = 0;
#endif

  atomic_set( &sbi->writeiter_cnt, opts->wb );
  atomic_set( &sbi->dirty_pages_count, 0 );

  return NULL;
}


///////////////////////////////////////////////////////////
// ufsd_fill_super
//
// This routine is a callback used to recognize and
// initialize superblock using this filesystem driver.
//
// sb - Superblock structure. On entry sb->s_dev is set to device,
//     sb->s_flags contains requested mount mode.
//     On exit this structure should have initialized root directory
//     inode and superblock callbacks.
//
// data - mount options in a string form.
//
// silent - non-zero if no messages should be displayed.
//
// Return: mount error code (0 means success)
///////////////////////////////////////////////////////////
noinline static int
ufsd_fill_super(
    IN OUT struct super_block *sb,
    IN void *data,
    IN int  silent,
    IN int  first_mount
    )
{
  ufsd_volume_info  info;
  ufsd_iget5_param param;
  ufsd_volume *Volume       = NULL;
  int err                   = -EINVAL; // default error
  usuper *sbi               = NULL;
  struct inode *i           = NULL;
  const char *parse_err     = NULL;
  struct block_device *bdev = sb->s_bdev;
  UINT64 sb_size            = bdev_nr_bytes( bdev );
  struct request_queue *q   = bdev_get_queue( bdev );
  unsigned int sector_size  = q? queue_logical_block_size( q ) : 512;

  TRACE_ONLY( const char *hint = ""; )

  if ( !q ) {
    assert( 0 );
    printk( KERN_NOTICE QUOTED_UFSD_DEVICE": bdev_get_queue( bdev ) returns NULL. Looks like config problem!\n" );
  }

  sbi = ufsd_heap_alloc( sizeof(usuper), 1 );
  assert( sbi );
  if ( !sbi )
    return -ENOMEM;

  sbi->sb = sb;

  mutex_init( &sbi->api_mutex );

  spin_lock_init( &sbi->ddt_lock );
  spin_lock_init( &sbi->nocase_lock );
  INIT_LIST_HEAD( &sbi->clear_list );
  INIT_LIST_HEAD( &sbi->write_list );

#if UFSD_SMART_DIRTY_SEC
  rwlock_init( &sbi->state_lock );
  init_waitqueue_head( &sbi->wait_done_flush );
  init_waitqueue_head( &sbi->wait_exit_flush );
#endif

  DEBUG_ONLY( spin_lock_init( &sbi->prof_lock ) );

  //
  // Save current bdi to check for media surprise remove
  // Set it before ufsd_parse_options (it will use sbi->bdi)
  //
  sbi->bdi = sb->s_bdi;

  sbi->bdev_blocksize_mask = bdev_logical_block_size(bdev) - 1;

  //
  // Check for size
  //
  if ( sb_size <= 10*PAGE_SIZE ) {
    printk( KERN_WARNING QUOTED_UFSD_DEVICE": \"%s\": the volume size (0x%llx bytes) is too small to keep any fs\n", sb->s_id, sb_size );
    TRACE_ONLY( hint = "too small"; )
    goto ExitInc;
  }

  //
  // Parse options
  //
  parse_err = ufsd_parse_options( sbi, (char*)data, first_mount );
  if ( parse_err ) {
    printk( KERN_ERR QUOTED_UFSD_DEVICE": failed to mount \"%s\". bad option \"%s\"\n", sb->s_id, parse_err );
    TRACE_ONLY( hint = "bad options"; )
    goto ExitInc;
  }

  //
  // Now trace is used
  //
  VfsTrace( +1, Dbg, ("fill_super(\"%s\"), %u: %lx, \"%s\", %s", sb->s_id, jiffies_to_msecs(jiffies-StartJiffies),
                       sb->s_flags, (char*)data,  silent ? "silent" : "verbose"));

#ifdef UFSD_DEBUG
  si_meminfo( &sbi->sys_info );

  DebugTrace( 0, Dbg, ("Pages: total=%lx, free=%lx, buff=%lx, shift="__stringify(PAGE_SHIFT)", stack="__stringify(THREAD_SIZE)"\n",
                        sbi->sys_info.totalram, sbi->sys_info.freeram, sbi->sys_info.bufferram ));
  DebugTrace( 0, Dbg, ("Page flags: lck=%x, ref=%x, upt=%x, drt=%x, wrb=%x, priv=%x, swc=%x\n",
                        1u<<PG_locked, 1u<<PG_referenced, 1u<<PG_uptodate, 1u<<PG_dirty, 1u<<PG_writeback, 1u<<PG_private, 1u<<PG_swapcache ));
  DebugTrace( 0, Dbg, ("Buff flags: upt=%x, drt=%x, lck=%x, map=%x, new=%x, del=%x, aread=%x, awrite=%x",
                        1u<<BH_Uptodate, 1u<<BH_Dirty, 1u<<BH_Lock, 1u<<BH_Mapped, 1u<<BH_New, 1u<<BH_Delay, 1u<<BH_Async_Read, 1u<<BH_Async_Write ));
  DebugTrace( 0, Dbg, ("O_flags: sync=o%o, dsync=o%o, di=o%o, ap=o%o",
                        __O_SYNC, O_DSYNC, O_DIRECT, O_APPEND ));
#endif

  //
  // Save 'sync' flag
  //
  if ( FlagOn( sb->s_flags, SB_SYNCHRONOUS ) )
    sbi->options.sync = 1;

  sb_set_blocksize( sb, PAGE_SIZE );
  sbi->dev_size   = sb_size;
  sbi->max_block  = sb_size >> PAGE_SHIFT;

  //
  // set s_fs_info to access options in BdRead/BdWrite
  //
  sb->s_fs_info = sbi;

  //
  // 'dev' member of superblock set to device in question.
  // At exit in case of filesystem been
  // successfully recognized next members of superblock should be set:
  // 's_magic'    - filesystem magic nr
  // 's_maxbytes' - maximal file size for this filesystem.
  //
  VfsTrace( 0, Dbg, ("\"%s\": size = 0x%llx*0x%x >= 0x%llx*0x%lx, bs=%x",
                        sb->s_id, sb_size>>blksize_bits( sector_size ), sector_size,
                        sbi->max_block, PAGE_SIZE,
                        q? queue_physical_block_size( q ) : 512 ));

  if ( !q || !q->limits.max_discard_sectors || !q->limits.discard_granularity ) {
    DebugTrace( 0, Dbg, ( "\"%s\": no discard", sb->s_id ));
  } else {
    sbi->discard_granularity          = q->limits.discard_granularity;
    sbi->discard_granularity_mask_inv = ~(UINT64)(sbi->discard_granularity-1);
    set_bit( UFSD_SBI_FLAGS_DISRCARD_BIT, &sbi->flags );
    DebugTrace( 0, Dbg, ( "\"%s\": discard_granularity = %x, max_discard_sectors = %x", sb->s_id, sbi->discard_granularity, q->limits.max_discard_sectors ));
  }

  err = ufsdapi_volume_mount( sb, sector_size, &sb_size, &sbi->options, &Volume, &sbi->fi );

  if ( err ) {
    if ( !silent )
      printk( KERN_ERR QUOTED_UFSD_DEVICE": failed to mount \"%s\"\n", sb->s_id);
    TRACE_ONLY( hint = "unknown fs"; )
    err = -EINVAL;
    goto Exit;
  }

  sb->s_d_op = sbi->options.use_dop? &ufsd_dop : NULL;
  sb->s_xattr = ufsd_xattr_handlers;
  sb->s_flags = (sb->s_flags & ~SB_POSIXACL) | SB_NODIRATIME
            | (sbi->options.noatime? SB_NOATIME : 0)
            | (sbi->options.acl? SB_POSIXACL : 0);

  //
  // At this point filesystem has been recognized.
  // Let's query for it's capabilities.
  //
  ufsdapi_query_volume_info( Volume, &info, NULL, 0, NULL );

  if ( !sb_rdonly( sb ) ){
    const char* hint = info.ReadOnly
      ? "No write support"
      : sbi->options.journal >= JOURNAL_STATUS_NEED_REPLAY
      ? "Journal is not replayed"
      : NULL;

    if( hint ){
      printk( KERN_WARNING QUOTED_UFSD_DEVICE": \"%s\": %s. Marking filesystem read-only\n", sb->s_id, hint );
      sb->s_flags |= SB_RDONLY;
    }
  }

  if ( !sb_rdonly( sb ) ) {
    if ( is_refs( sbi ) && THREAD_SIZE < UFSD_MIN_REFS_RW_STACK ) {
      printk( KERN_CRIT QUOTED_UFSD_DEVICE": \"%s\": Refs rw requires 16K+ kernel stack (THREAD_SIZE=%uK)\n", sb->s_id, (unsigned)(THREAD_SIZE >> 10) );
      err = -EINVAL;
      goto Exit;
    }

    //
    // Check for dirty flag
    //
    if ( info.dirty && !sbi->options.force ) {
      printk( KERN_WARNING QUOTED_UFSD_DEVICE": volume is dirty and \"force\" flag is not set\n" );
      TRACE_ONLY( hint = "no \"force\" and dirty"; )
      err = -1000; // Return special value to detect no 'force'
      goto Exit;
    }
  }

#ifdef UFSD_USE_READ_WRITE
  //
  // Allocate helper buffer
  //
  if ( is_ntfs( sbi ) || is_refs( sbi ) || is_apfs( sbi ) ) {
    sbi->rw_buffer = __vmalloc( RW_BUFFER_SIZE, GFP_NOFS | __GFP_HIGHMEM );
    if ( !sbi->rw_buffer ) {
      err = -ENOMEM;
      goto Exit;
    }
  }
#endif

  //
  // Set maximum file size and 'end of directory'
  //
  sb->s_maxbytes        = MAX_LFS_FILESIZE;
  sbi->maxbytes         = info.maxbytes;
  sbi->maxbytes_sparse  = info.maxbytes_sparse;
  sbi->end_of_dir       = info.end_of_dir;

  // Always setup 's_time_gran' even you never use it explicitly
  if ( is_hfs( sbi ) )
    sb->s_time_gran = NSEC_PER_SEC; // 1 sec
  else if ( is_fat( sbi ) )
    sb->s_time_gran = 1;  // to avoid mix time manipulation (vfs rounds down, ufsd rounds up) use maximum time resolution
  else if ( is_exfat( sbi ) )
    sb->s_time_gran = NSEC_PER_SEC / 100; // 10 msec
  else
    sb->s_time_gran = 100; // 100 nsec

  sbi->bytes_per_cluster  = info.bytes_per_cluster;
  sbi->cluster_mask       = info.bytes_per_cluster-1;
  sbi->cluster_mask_inv   = ~(UINT64)sbi->cluster_mask;

  //
  // At this point I know enough to allocate my root.
  //
  sb->s_magic       = info.fs_signature;
  sb->s_op          = &ufsd_sops;
  // NFS support
#ifdef UFSD_USE_ENCODE_FH
  if ( is_exfat( sbi ) || is_fat( sbi ) || is_apfs( sbi ) )
    sb->s_export_op = &ufsd_encode_export_op;
  else
#endif
  {
#ifdef UFSD_USE_ID
    sb->s_export_op = &ufsd_export_op;
#endif
  }

  sbi->ufsd         = Volume;
  assert(UFSD_SB( sb ) == sbi);
  assert(UFSD_VOLUME(sb) == Volume);

  memset( &param, 0, sizeof(param) );
  param.name = "/";
  param.name_len = 1;

  if ( !ufsdapi_file_open( Volume, NULL, &param ) )
    i = iget5( sb, &param );

  if ( unlikely( !i ) ) {
    printk( KERN_ERR QUOTED_UFSD_DEVICE": failed to open root on \"%s\"\n", sb->s_id );
    TRACE_ONLY( hint = "open root"; )
    err = -EINVAL;
    goto Exit;
  }

  // Always clear S_IMMUTABLE
  i->i_flags &= ~S_IMMUTABLE;
  sb->s_root = d_make_root( i );

  if ( !sb->s_root ) {
    TRACE_ONLY( hint = "no memory"; )
    err = -ENOMEM;
    // Not necessary to close root_ufsd
    goto Exit;
  }

  if ( sbi->options.raKb )
    sb->s_bdi->ra_pages = sbi->options.raKb >> ( PAGE_SHIFT-10 );

  //
  // Start flush thread.
  // To simplify remount logic do it for read-only volumes too
  //
#if UFSD_SMART_DIRTY_SEC
  {
    void *p = kthread_run( ufsd_flush_thread, sb, "ufsd_%s", sb->s_id );
    if ( IS_ERR( p ) ) {
      err = PTR_ERR( p );
      TRACE_ONLY( hint = "flush thread"; )
      goto Exit;
    }

    wait_event( sbi->wait_done_flush, sbi->flush_task );
  }
#endif

  // Create /proc/fs/ufsd/..
  ufsd_proc_info_create( sb );

  //
  // Done.
  //
  VfsTrace( -1, Dbg, ("fill_super(\"%s\"), %u -> sb=%pK,i=%pK,r=%lx,uid=%d,gid=%d,m=%o", sb->s_id, jiffies_to_msecs(jiffies-StartJiffies), sb, i,
                        i->i_ino, __kuid_val( i->i_uid ), __kgid_val( i->i_gid ), i->i_mode ));

  return 0;

ExitInc:
#ifdef UFSD_TRACE
  if ( ufsd_trace_level & Dbg )
    ufsd_trace_inc( +1 ); // compensate the last 'DebugTrace( -1, ... )'
#endif

Exit:
  //
  // Free resources allocated in this function in reverse order
  //
  if ( sb->s_root ) {
    d_drop( sb->s_root );
    sb->s_root = NULL;
  }

  if ( i )
    iput( i );

  if ( Volume )
    ufsdapi_volume_umount( Volume );

  assert( sbi );
  mutex_destroy( &sbi->api_mutex );
  ufsd_uload_nls( &sbi->options );

  VfsTrace( -1, Dbg, ("fill_super failed to mount %s: \"%s\" ->%d", sb->s_id, hint, err));

  ufsd_heap_free( sbi );
  sb->s_fs_info = NULL;

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_fill_super_trace
//
// This is a "pass thru" wrapper call for `ufsd_fill_super' callback
// to try mount again when mount operation was failed
// and trace level was less than "all"
//
///////////////////////////////////////////////////////////
static inline int
ufsd_fill_super_trace(
    IN OUT struct super_block *sb,
    IN void *data,
    IN int  silent
    )
{
  int err = ufsd_fill_super( sb, data, silent, 1 );

#ifdef UFSD_TRACE
  if ( unlikely( err && -EINTR != err && -ENOMEM != err ) ) {
    mutex_lock( &s_MountMutex );
    if ( UFSD_LEVEL_DEFAULT == ufsd_trace_level ) {
      int ret;
      ufsd_trace_level = UFSD_LEVEL_STR_ALL;

      ret = ufsd_fill_super( sb, data, silent, 0 );

      ufsd_trace_level = UFSD_LEVEL_DEFAULT;
      assert( ret && ret == err );
      err = ret;
    }
    mutex_unlock( &s_MountMutex );
  }
#endif

  if ( unlikely( -EINTR == err || -ENOMEM == err ) )
    printk( KERN_CRIT QUOTED_UFSD_DEVICE": failed to mount %s -> %d\n", sb->s_id, err );

  return err;
}


///////////////////////////////////////////////////////////
// ufsd_mount
//
// fstype::mount
///////////////////////////////////////////////////////////
static struct dentry*
ufsd_mount(
    IN struct file_system_type  *fs_type,
    IN int        flags,
    IN const char *dev_name,
    IN void       *data
    )
{
  return mount_bdev( fs_type, flags, dev_name, data, ufsd_fill_super_trace );
}

static struct file_system_type ufsd_fs_type = {
  .name       = QUOTED_UFSD_DEVICE,
  .fs_flags   = FS_REQUIRES_DEV,
  .mount      = ufsd_mount,
  .kill_sb    = kill_block_super,
  .owner      = THIS_MODULE,
};

///////////////////////////////////////////////////////////
// ufsd_init
//
// module init function
///////////////////////////////////////////////////////////
static int
__init ufsd_init(void)
{
  int ret;
  int EndianError;

  TRACE_ONLY( mutex_init( &s_MountMutex ); )
  TRACE_ONLY( StartJiffies=jiffies; )

  TRACE_ONLY( parse_trace_level( ufsd_trace_level_ ); )

  printk( KERN_NOTICE QUOTED_UFSD_DEVICE": driver (%s)\n%s%s", s_DriverVer, ufsdapi_library_version( &EndianError ),
#ifdef DEFAULT_MOUNT_OPTIONS
      "Default options: " DEFAULT_MOUNT_OPTIONS "\n"
#endif
      "" );
  printk( KERN_NOTICE QUOTED_UFSD_DEVICE": PAGE_SIZE=%uK, THREAD_SIZE=%uk\n", (unsigned)(PAGE_SIZE>>10), (unsigned)(THREAD_SIZE>>10) );

  if ( EndianError )
    return -EINVAL;

#if defined UFSD_HASH_VAL_H && !defined UFSD_DISABLE_CONF_CHECK
  ufsd_check_config_hash();
#endif

#if defined UFSD_EXFAT || defined UFSD_FAT
  //
  // exfat stores dates relative 1980
  // 'get_seconds' returns seconds since 1970
  // Check current date
  {
    struct timespec64 ts;
    ktime_get_coarse_real_ts64( &ts );
    if ( ts.tv_sec < Seconds1970To1980 )
      printk( KERN_NOTICE QUOTED_UFSD_DEVICE": (ex)fat can't store dates before Jan 1, 1980. Please update current date\n" );
  }
#endif

  ufsd_proc_create();

  unode_cachep  = kmem_cache_create( QUOTED_UFSD_DEVICE "_unode_cache", sizeof(unode), 0, SLAB_RECLAIM_ACCOUNT, init_once );
  if ( !unode_cachep ) {
    ret = -ENOMEM;
  } else {
    //
    // Allow UFSD to init globals
    //
    ret = ufsdapi_init( PAGE_SIZE, THREAD_SIZE );
    if ( !ret ) {
      //
      // Finally register filesystem
      //
      ret = register_filesystem( &ufsd_fs_type );
      if ( !ret )
        return 0; // Ok
    }

    //
    // Deinit UFSD globals
    //
    ufsdapi_exit();

    kmem_cache_destroy( unode_cachep );
  }

  // remove /proc/fs/ufsd
  ufsd_proc_delete();

  return ret;
}


///////////////////////////////////////////////////////////
// ufsd_exit
//
// module exit function
///////////////////////////////////////////////////////////
static void
__exit ufsd_exit(void)
{
  // remove /proc/fs/ufsd
  ufsd_proc_delete();

  unregister_filesystem( &ufsd_fs_type );

  //
  // Deinit UFSD globals
  //
  ufsdapi_exit();

  kmem_cache_destroy( unode_cachep );

#if defined UFSD_TRACE && defined UFSD_DEBUG && defined UFSD_USE_SHARED_FUNCS
  {
    int i;
    for ( i = 0; i < ARRAY_SIZE(s_shared); i++ ) {
      if ( s_shared[i].cnt ) {
        DebugTrace( 0, UFSD_LEVEL_ERROR, ("forgotten shared ptr %pK,%x,%d", s_shared[i].ptr, s_shared[i].len, s_shared[i].cnt ));
      }
    }
  }
#endif

#ifdef UFSD_DEBUG_ALLOC
  {
    struct list_head *pos, *pos2;
    assert(!TotalAllocs);
    trace_mem_report( 1 );
    list_for_each_safe( pos, pos2, &TotalAllocHead )
    {
      memblock_head *block = list_entry( pos, memblock_head, Link );
      DebugTrace( 0, UFSD_LEVEL_ERROR, ("block %pK, seq=%x, 0x%x bytes: [%*ph]", block+1, block->seq, block->size, min_t( unsigned, 16, block->size ), block+1 ));

      // Don't: (( block->asize & 1U)? vfree : kfree)( block );
      // 'cause declaration of vfree and kfree differs!
      if ( block->asize & 1U ) {
        vfree( block );
      } else {
        kfree( block );
      }
    }
  }
#ifdef UFSD_DEBUG
  DebugTrace( 0, UFSD_LEVEL_ERROR, ("inuse = %u msec, wait = %u msec, HZ=%u", jiffies_to_msecs( jiffies - StartJiffies ), jiffies_to_msecs( WaitMutex ), (unsigned)HZ ));
#endif
#endif

#ifndef UFSD_ANDROID_KMI_DENIED
  ufsd_close_trace( 0 );
#endif
  TRACE_ONLY( mutex_destroy( &s_MountMutex ); )

  printk( KERN_NOTICE QUOTED_UFSD_DEVICE": driver unloaded\n" );
}

//
// And now the modules code and kernel interface.
//
MODULE_DESCRIPTION("Paragon " QUOTED_UFSD_DEVICE " driver");
MODULE_AUTHOR("Andrey Shedel & Alexander Mamaev");
MODULE_LICENSE("Commercial product");
#ifdef ANDROID_GKI_VFS_EXPORT_ONLY
MODULE_IMPORT_NS(VFS_internal_I_am_really_a_filesystem_and_am_NOT_a_driver);
#endif

#ifdef UFSD_TRACE
module_param_string(trace, ufsd_trace_level_, sizeof(ufsd_trace_level_), S_IRUGO);
MODULE_PARM_DESC(trace, " trace level for ufsd module");
#ifndef UFSD_ANDROID_KMI_DENIED
module_param_string(log, ufsd_trace_file, sizeof(ufsd_trace_file), S_IRUGO);
MODULE_PARM_DESC(log, " ufsd log file, default is system log");
module_param_named(cycle, ufsd_cycle_mb, ulong, S_IRUGO);
MODULE_PARM_DESC(cycle, " the size of cycle log in MB, default is 0");
#endif
#endif

module_init(ufsd_init)
module_exit(ufsd_exit)
