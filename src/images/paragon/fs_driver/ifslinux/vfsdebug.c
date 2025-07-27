// <copyright file="vfsdebug.c" company="Paragon Software Group">
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

    vfsdebug.c

Abstract:

    This module implements UFSD debug subsystem

Author:

    Ahdrey Shedel

Revision History:

    18/09/2000 - Andrey Shedel - Created
    Since 29/07/2005 - Alexander Mamaev

--*/

#include <linux/version.h>
#include <linux/fs.h>
#include <linux/proc_fs.h>

#include "config.h"
#include "ufsdapi.h"
#include "vfsdebug.h"

#ifdef UFSD_TRACE

#include <linux/module.h>
#include <linux/seq_file.h>

char ufsd_trace_level_[16];
#ifndef UFSD_ANDROID_KMI_DENIED
char ufsd_trace_file[128];
#endif

//
// Activate this define to build driver with predefined trace and log
//
//#define UFSD_DEFAULT_LOGTO  "/ufsd/ufsd.log"

#ifdef UFSD_DEFAULT_LOGTO
  #define ufsd_trace_file  UFSD_DEFAULT_LOGTO
  unsigned long ufsd_trace_level  = UFSD_LEVEL_STR_ALL;
  unsigned long ufsd_cycle_mb     = 2048;
#else
  unsigned long ufsd_trace_level  = UFSD_LEVEL_DEFAULT;
  unsigned long ufsd_cycle_mb     = 0;
#endif

unsigned long disable_trace;
atomic_t ufsd_trace_indent;
#ifndef UFSD_ANDROID_KMI_DENIED
static DECLARE_RWSEM(log_file_mutex);
static struct file *log_file;
static int log_file_opened;
#endif
static int indent_printed;
DEBUG_ONLY( static int len_printed; )

static void ufsd_log( const char *fmt, int len, int err_msg );

//
// This mutex is used to protect 'ufsd_trace_level'
//
struct mutex  s_MountMutex;

//#define UFSD_ACTIVATE_KEEP_TRACE_ON

#ifdef UFSD_ACTIVATE_KEEP_TRACE_ON

static int        s_KeepLogs;
static atomic_t   s_LogCnt;
#define MAX_LOG_CNT   10000
static LIST_HEAD( s_MountStr );
static DEFINE_SPINLOCK( s_TraceSpin ); // to protect s_MountStr

struct str_entry{
  struct list_head entry;
  int     len;
  char    buf[1];
};


///////////////////////////////////////////////////////////
// ufsd_keep_trace_on
//
// activate trace keep. Called from fill_super after locking s_MountMutex
///////////////////////////////////////////////////////////
void
ufsd_keep_trace_on( void )
{
  assert( mutex_is_locked( &s_MountMutex ) );
  assert( !s_KeepLogs );
  s_KeepLogs  = 1;
  atomic_set( &s_LogCnt, 0 );
}


///////////////////////////////////////////////////////////
// ufsd_keep_trace_off
//
// deactivate trace keep. Called from fill_super before unlocking s_MountMutex
///////////////////////////////////////////////////////////
void
ufsd_keep_trace_off(
    IN int print_logs
    )
{
  assert( mutex_is_locked( &s_MountMutex ) );
  s_KeepLogs = 0;

  spin_lock( &s_TraceSpin );
  while( !list_empty( &s_MountStr ) ) {
    struct str_entry* e = list_entry( s_MountStr.next, struct str_entry, entry );
    list_del( &e->entry );
    spin_unlock( &s_TraceSpin );

    if ( print_logs )
      ufsd_log( e->buf, e->len, '*' == e->buf[0] && '*' == e->buf[1] && '*' == e->buf[2] && '*' == e->buf[3] );

    kfree( e );
    spin_lock( &s_TraceSpin );
  }

  spin_unlock( &s_TraceSpin );
}
#endif // #ifdef UFSD_ACTIVATE_KEEP_TRACE_ON


///////////////////////////////////////////////////////////
// ufsd_trace_inc
//
//
///////////////////////////////////////////////////////////
UFSDAPI_CALL void
ufsd_trace_inc_dbg(
    IN int indent
    )
{
  atomic_add( indent, &ufsd_trace_indent );
}

extern const char s_FileVer[];
extern const char s_DriverVer[];

///////////////////////////////////////////////////////////
// format_hdr
//
// Formats standard header for log file
///////////////////////////////////////////////////////////
static inline unsigned
format_hdr(
    IN char *buffer,
    IN unsigned buflen
    )
{
  return
    snprintf( buffer, buflen,
              "Kernel version %d.%d.%d, cpus="_QUOTE2(NR_CPUS)"\n"
              "%s"
              "%s%s\n"
#if defined UFSD_HASH_VAL_H && !defined UFSD_DISABLE_CONF_CHECK
              "Kernel .config hash: %s.\n"
#endif
#ifdef UFSD_DEBUG
              "sizeof(inode)=%zu\n"
#endif
              ,
              LINUX_VERSION_CODE>>16, (LINUX_VERSION_CODE>>8)&0xFF, LINUX_VERSION_CODE&0xFF,
              ufsdapi_library_version( NULL ),
              s_FileVer, s_DriverVer
#if defined UFSD_HASH_VAL_H && !defined UFSD_DISABLE_CONF_CHECK
              , ufsd_hash_check_result
#endif
#ifdef UFSD_DEBUG
              , sizeof(struct inode)
#endif
              );
}

#ifndef UFSD_ANDROID_KMI_DENIED
///////////////////////////////////////////////////////////
// write_header_in_log_file
//
// Print header in provided log file
// Negative return value - error
///////////////////////////////////////////////////////////
static ssize_t
write_header_in_log_file(
    IN struct file *log_file
    )
{
  ssize_t werr = -1;
  const unsigned buflen = 1024;
  char *buffer = kmalloc( buflen, GFP_NOFS );
  if ( buffer ) {
    unsigned hdr_len = format_hdr( buffer, buflen );
    if ( hdr_len > buflen )
      hdr_len = buflen;
    werr = kernel_write( log_file, buffer, hdr_len, &log_file->f_pos );
    kfree( buffer );
  }
  return werr;
}
#endif

///////////////////////////////////////////////////////////
// ufsd_log
//
// The main logging function
///////////////////////////////////////////////////////////
noinline static void
ufsd_log(
    IN const char *fmt,
    IN int len,
    IN int err_msg
    )
{
  int log_status = 0;

  if ( len <= 0 || !fmt[0] )
    return;

#ifdef UFSD_ACTIVATE_KEEP_TRACE_ON
  if ( s_KeepLogs && mutex_is_locked( &s_MountMutex ) ) {
    //
    // This function may be called from different threads
    //
    if ( atomic_inc_return( &s_LogCnt ) < MAX_LOG_CNT ) {
      struct str_entry* e = (struct str_entry*)kmalloc( len + offsetof(struct str_entry, buf) + 1, GFP_KERNEL );
      if ( e ) {
        spin_lock( &s_TraceSpin );
        list_add_tail( &e->entry, &s_MountStr );
        spin_unlock( &s_TraceSpin );
        e->len = len;
        memcpy( e->buf, fmt, len );
        e->buf[len] = 0;
      }
    }
    return;
  }
#endif

#ifndef UFSD_ANDROID_KMI_DENIED
  down_read( &log_file_mutex );

  if ( ( log_file || !log_file_opened ) && !( current->flags & (PF_MEMALLOC|PF_KSWAPD) ) ) {
    long werr = 0;

    if ( !log_file_opened && ufsd_trace_file[0] ) {
      int need_close = 0;
      struct file *new_log_file = filp_open( ufsd_trace_file, O_WRONLY | O_CREAT | O_TRUNC | O_LARGEFILE, S_IRUGO | S_IWUGO );
      if ( IS_ERR( new_log_file ) ) {
        printk( KERN_NOTICE  QUOTED_UFSD_DEVICE ": failed to start log to '%s' (errno=%ld), use system log\n", ufsd_trace_file, PTR_ERR( new_log_file ) );
        new_log_file = NULL;
      }
      up_read( &log_file_mutex );
      down_write( &log_file_mutex );
      if ( !log_file_opened ) {
        log_file_opened = 1;
        log_file = new_log_file;
      } else {
        // Someone already opened file
        need_close = 1;
      }
      downgrade_write( &log_file_mutex );
      if ( need_close ) {
        if ( new_log_file )
          filp_close( new_log_file, NULL );
      }

      if ( !need_close && log_file ) {
        // We opened file - write log header
        werr = write_header_in_log_file( log_file );
        if ( werr < 0 )
          goto log_failed;
      }
    }

    if ( log_file ) {
      // preserve 'fmt' and 'len'. They may be used later in printk
      int lenw = len;
      const char* fmtw = fmt;
      if ( ufsd_cycle_mb ) {
        size_t bytes  = ufsd_cycle_mb << 20;
        int to_write  = log_file->f_pos + len > bytes? (bytes - log_file->f_pos) : len;
        if ( to_write > 0 ) {
          werr = kernel_write( log_file, fmtw, to_write, &log_file->f_pos );
          fmtw += to_write;
          lenw -= to_write;
        }

        if ( lenw )
          log_file->f_pos = 0;
      }

      if ( lenw )
        werr = kernel_write( log_file, fmtw, lenw, &log_file->f_pos );

      if ( werr < 0 ) {
log_failed:
        printk( KERN_ERR QUOTED_UFSD_DEVICE ": log write failed: %ld\n", werr );
        up_read( &log_file_mutex );
        down_write( &log_file_mutex );
        if ( log_file ) {
          filp_close( log_file, NULL );
          log_file = NULL;
        }
        downgrade_write( &log_file_mutex );
      }
    }

    if ( werr > 0 && !err_msg )
      log_status = 1; // This is normal way of logging in file
  }

  up_read( &log_file_mutex );
#endif

  if ( log_status )
    return;

//  printk( KERN_NOTICE  QUOTED_UFSD_DEVICE ":%*.s", len, fmt );
  printk( err_msg
          ? KERN_ERR    QUOTED_UFSD_DEVICE ": %s"
          : KERN_NOTICE QUOTED_UFSD_DEVICE ": %s",
          fmt );
//  if ( err_msg )
//    dump_stack();
}


#ifndef UFSD_ANDROID_KMI_DENIED
///////////////////////////////////////////////////////////
// ufsd_close_trace
//
// need_reopen - if non-zero value, then try to open new log file
///////////////////////////////////////////////////////////
void
ufsd_close_trace( int need_reopen )
{
  struct file *new_log_file = NULL;

  if ( need_reopen && ufsd_trace_file[0] ) {
#ifdef UFSD_DEFAULT_LOGTO
    if ( log_file )
      return;
#endif
    new_log_file = filp_open( ufsd_trace_file, O_WRONLY | O_CREAT | O_TRUNC | O_LARGEFILE, S_IRUGO | S_IWUGO );
    if ( IS_ERR( new_log_file ) ) {
      printk( KERN_NOTICE  QUOTED_UFSD_DEVICE ": failed to start log to '%s' (errno=%ld), use system log\n", ufsd_trace_file, PTR_ERR( new_log_file ) );
      new_log_file = NULL;
    } else {
      // We opened file - write log header
      ssize_t werr = write_header_in_log_file( new_log_file );
      if ( werr < 0 ) {
        printk( KERN_ERR QUOTED_UFSD_DEVICE ": new log write failed: %zd\n", werr );
        filp_close( new_log_file, NULL );
        new_log_file = NULL;
      }
    }
  }

  down_write( &log_file_mutex );
  if ( log_file )
    filp_close( log_file, NULL );
  log_file_opened = 1;
  log_file = new_log_file;
  indent_printed = 0;
  DEBUG_ONLY( len_printed = 0; )
  up_write( &log_file_mutex );
}
#endif


UFSDAPI_CALL noinline void
ufsd_vtrace(
    IN const char *fmt,
    IN va_list    ap
    );


///////////////////////////////////////////////////////////
// ufsd_trace
//
//
///////////////////////////////////////////////////////////
UFSDAPI_CALLv void
ufsd_trace( const char *fmt, ... )
{
  va_list ap;
  va_start( ap, fmt );
  ufsd_vtrace( fmt, ap );
  va_end( ap );
}


#define STATUS_LOG_FILE_FULL              (int)0xC0000188 // -1073741432

///////////////////////////////////////////////////////////
// ufsd_error
//
//
///////////////////////////////////////////////////////////
UFSDAPI_CALL void
ufsd_error( int Err, const char *FileName, int Line )
{
  const char *Name;

  if ( STATUS_LOG_FILE_FULL == Err )
    return; // do not trace this error

  Name = strrchr( FileName, '/' );
  if ( !Name )
    Name = FileName - 1;

  // Print the line number first 'cause the full name can be too long
  ufsd_trace( "\"%s\": UFSD error 0x%x, %d, %s\n", current->comm, Err, Line, Name + 1 );
//  BUG_ON( 1 );
}


static char     s_buf[512];
static atomic_t i_buf = ATOMIC_INIT(1); // 1 means 'free s_buf'

//#define UFSD_MIN_LOG_INFO  "Activate this define to minimize info in log (pid/name)"

///////////////////////////////////////////////////////////
// ufsd_vtrace
//
//
///////////////////////////////////////////////////////////
UFSDAPI_CALL noinline void
ufsd_vtrace(
    IN const char *fmt,
    IN va_list    ap
    )
{
  int len;
  int err_msg = '*' == fmt[0] && '*' == fmt[1] && '*' == fmt[2] && '*' == fmt[3];
  char* buf;

  if ( disable_trace )
    return;

  if ( atomic_dec_and_test( &i_buf ) ) {
    buf = s_buf;
  } else {
    buf = (char*)kmalloc( sizeof(s_buf), GFP_NOFS );
    if ( !buf )
      goto out;
  }

#ifdef UFSD_MIN_LOG_INFO
  len = 0;
#else
  len = snprintf( buf, sizeof(s_buf), "%u(%s): ", current->pid, current->comm );
#endif

  if ( !err_msg ) {
    int idx = atomic_read( &ufsd_trace_indent );
    if ( idx > 0 ) {
      idx %= 20;
      memset( buf + len, ' ', idx );
      len += idx;
    } else if ( idx < 0 && !indent_printed ) {
      indent_printed = 1;
      ufsd_log( "**** trace_indent < 0\n", sizeof("**** trace_indent < 0\n") - 1, 1 );
    }
  }

  len += vsnprintf( buf + len, sizeof(s_buf) - len, fmt, ap );

  // check for sizeof(s_buf) - 1 because we will need to insert '\n' in buffer
  if ( len >= sizeof(s_buf) - 1 ) {
#ifdef UFSD_DEBUG
    if ( !len_printed ) {
      len_printed = 1;
      ufsd_log( "**** too long log string\n", sizeof("**** too long log string\n") - 1, 1 );
//      dump_stack(); // to find too big trace string
    }
#endif
    len = sizeof(s_buf) - 1;
    buf[sizeof(s_buf) - 4] = '.';
    buf[sizeof(s_buf) - 3] = '.';
    buf[sizeof(s_buf) - 2] = '\n';
    buf[sizeof(s_buf) - 1] = '\0';
  } else if ( len > 0 && '\n' != buf[len - 1] ) {
    buf[len] = '\n';
    ++len;
    buf[len] = '\0';
  }

  ufsd_log( buf, len, err_msg );

  if ( buf != s_buf )
    kfree( buf );

out:
  atomic_inc( &i_buf );

  // to stop on asserts just uncomment this line
//  BUG_ON( err_msg );
}


///////////////////////////////////////////////////////////
// parse_trace_level
//
// parses string for trace level
// It sets global variables 'ufsd_trace_level'
///////////////////////////////////////////////////////////
void
parse_trace_level(
    IN const char *v
    )
{
  if ( !v || !v[0] )
    ufsd_trace_level = UFSD_LEVEL_DEFAULT;
  else if ( !strcmp( v, "all" ) )
    ufsd_trace_level = UFSD_LEVEL_STR_ALL;
  else if ( !strcmp( v, "vfs" ) )
    ufsd_trace_level = UFSD_LEVEL_STR_VFS;
  else if ( !strcmp( v, "lib" ) )
    ufsd_trace_level = UFSD_LEVEL_STR_LIB;
  else if ( !strcmp( v, "mid" ) )
    ufsd_trace_level = UFSD_LEVEL_STR_MID;
  else if ( !strcmp( v, "io" ) )
    ufsd_trace_level = UFSD_LEVEL_IO;
  else if ( !strcmp( v, "tst" ) )
    ufsd_trace_level = UFSD_LEVEL_STR_TST;
  else if ( !strcmp( v, "default" ) )
    ufsd_trace_level = UFSD_LEVEL_DEFAULT;
  else if ( '-' == v[0] )
    ufsd_trace_level = simple_strtol( v, NULL, 10 );
  else
    ufsd_trace_level = simple_strtoul( v, NULL, 16 );
  DebugTrace( 0, UFSD_LEVEL_ALWAYS, ("trace mask set to %08lx (\"%s\")\n", ufsd_trace_level, v ? v : ""));
}


///////////////////////////////////////////////////////////
// parse_cycle_value
//
// parses string for cycle=XXX
// It sets global variables 'ufsd_cycle_mb'
///////////////////////////////////////////////////////////
void
parse_cycle_value(
    IN const char *v
    )
{
  unsigned long tmp;
  // Support both forms: 'cycle' and 'cycle=256'
  if ( !v || !v[0] )
    tmp = 1;
  else {
    char* n;
    tmp = simple_strtoul( v, &n, 0 );
    if ( 'K' == *n )
      tmp *= 1024;
    else if ( 'M' == *n )
      tmp *= 1024*1024;
    else if ( 'G' == *n )
      tmp *= 1024*1024*1024;
  }
  ufsd_cycle_mb = (tmp + 1024*1024 - 1) >> 20;
}


///////////////////////////////////////////////////////////
// ufsd_bd_name
//
// Returns the name of block device
///////////////////////////////////////////////////////////
const char*
UFSDAPI_CALL
ufsd_bd_name(
    IN struct super_block *sb
    )
{
  return sb->s_id;
}


///////////////////////////////////////////////////////////
// ufsd_proc_dev_trace_show
//
// /proc/fs/ufsd/trace
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_trace_show(
    IN struct seq_file  *m,
    IN void             *o
    )
{
  const char *hint;
  switch( ufsd_trace_level ) {
  case UFSD_LEVEL_STR_ALL:  hint = "all"; break;
  case UFSD_LEVEL_STR_VFS:  hint = "vfs"; break;
  case UFSD_LEVEL_STR_LIB:  hint = "lib"; break;
  case UFSD_LEVEL_STR_MID:  hint = "mid"; break;
  case UFSD_LEVEL_STR_TST:  hint = "tst"; break;
  case UFSD_LEVEL_STR_DEFAULT:  hint = "default"; break;
  default:
    seq_printf( m, "%lx\n", ufsd_trace_level );
    return 0;
  }
  seq_printf( m, "%s\n", hint );
  return 0;
}


static int ufsd_proc_dev_trace_open(struct inode *inode, struct file *file)
{
  return single_open( file, ufsd_proc_dev_trace_show, NULL );
}


///////////////////////////////////////////////////////////
// ufsd_proc_dev_trace_write
//
// /proc/fs/ufsd/trace
///////////////////////////////////////////////////////////
static ssize_t
ufsd_proc_dev_trace_write(
    IN struct file  *file,
    IN const char __user *buffer,
    IN size_t       count,
    IN OUT loff_t   *ppos
    )
{
  //
  // Copy buffer into kernel memory
  //
  char kbuffer[16];
  size_t len = min_t( size_t, count, sizeof(kbuffer) - 1 );

  if ( copy_from_user( kbuffer, buffer, len ) )
    return -EINVAL;

  // Remove last '\n'
  while( len > 0 && '\n' == kbuffer[len-1] )
    len -= 1;

  // Set last zero
  kbuffer[len] = 0;

  mutex_lock( &s_MountMutex );
  parse_trace_level( kbuffer );
  mutex_unlock( &s_MountMutex );

  *ppos += count;
  return count;
}


const struct proc_ops ufsd_proc_dev_trace_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_trace_open,
  .proc_write    = ufsd_proc_dev_trace_write,
};

#ifndef UFSD_ANDROID_KMI_DENIED
///////////////////////////////////////////////////////////
// ufsd_proc_dev_log_show
//
// /proc/fs/ufsd/trace
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_log_show(
    IN struct seq_file  *m,
    IN void             *o
    )
{
  seq_printf( m, "%s\n", ufsd_trace_file );
  return 0;
}

static int ufsd_proc_dev_log_open( struct inode *inode, struct file *file )
{
  return single_open( file, ufsd_proc_dev_log_show, NULL );
}


///////////////////////////////////////////////////////////
// ufsd_proc_dev_log_write
//
// /proc/fs/ufsd/trace
///////////////////////////////////////////////////////////
static ssize_t
ufsd_proc_dev_log_write(
    IN struct file  *file,
    IN const char __user *buffer,
    IN size_t       count,
    IN OUT loff_t   *ppos
    )
{
  //
  // Copy buffer into kernel memory
  //
  char kbuffer[sizeof(ufsd_trace_file)];
  size_t len = min_t( size_t, count, sizeof(kbuffer) - 1 );

  if ( copy_from_user( kbuffer, buffer, len ) )
    return -EINVAL;

  // Remove last '\n'
  while( len > 0 && '\n' == kbuffer[len-1] )
    len -= 1;

  // Set last zero
  kbuffer[len] = 0;

#ifndef UFSD_DEFAULT_LOGTO
  if ( strcmp( ufsd_trace_file, kbuffer ) ) {
    memcpy( ufsd_trace_file, kbuffer, len + 1 );
    ufsd_close_trace( 1 );
  }
#endif

  *ppos += count;
  return count;
}


const struct proc_ops ufsd_proc_dev_log_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_log_open,
  .proc_write    = ufsd_proc_dev_log_write,
};


///////////////////////////////////////////////////////////
// ufsd_proc_dev_cycle_show
//
// /proc/fs/ufsd/cycle
///////////////////////////////////////////////////////////
static int
ufsd_proc_dev_cycle_show(
    IN struct seq_file  *m,
    IN void             *o
    )
{
  seq_printf( m, "%lu\n", ufsd_cycle_mb );
  return 0;
}


static int ufsd_proc_dev_cycle_open( struct inode *inode, struct file *file )
{
  return single_open( file, ufsd_proc_dev_cycle_show, NULL );
}


///////////////////////////////////////////////////////////
// ufsd_proc_dev_cycle_write
//
// /proc/fs/ufsd/cycle
///////////////////////////////////////////////////////////
static ssize_t
ufsd_proc_dev_cycle_write(
    IN struct file  *file,
    IN const char __user *buffer,
    IN size_t       count,
    IN OUT loff_t   *ppos
    )
{
  //
  // Copy buffer into kernel memory
  //
  char kbuffer[16];
  size_t len = min_t( size_t, count, sizeof(kbuffer) - 1 );

  if ( copy_from_user( kbuffer, buffer, len ) )
    return -EINVAL;

  // Remove last '\n'
  while( len > 0 && '\n' == kbuffer[len-1] )
    len -= 1;

  // Set last zero
  kbuffer[len] = 0;

  parse_cycle_value( kbuffer );
  *ppos += count;
  return count;
}


const struct proc_ops ufsd_proc_dev_cycle_fops = {
  .proc_read     = seq_read,
  .proc_lseek    = seq_lseek,
  .proc_release  = single_release,
  .proc_open     = ufsd_proc_dev_cycle_open,
  .proc_write    = ufsd_proc_dev_cycle_write,
};
#endif
#endif // #ifdef UFSD_TRACE


#ifdef UFSD_TRACEK
//
// This variable is used to get the bias
//
extern struct timezone sys_tz;

///////////////////////////////////////////////////////////
// ufsd_time_str
//
// Returns current time to sting form
///////////////////////////////////////////////////////////
int UFSDAPI_CALL
ufsd_time_str(
    OUT char *buffer,
    IN int buffer_len
    )
{
  struct tm tm;

  struct timespec64 ts;
  ktime_get_coarse_real_ts64( &ts );

#if 0
  // print time in UTC
  time64_to_tm( ts.tv_sec, 0, &tm );
  return snprintf( buffer, buffer_len, "%ld-%02d-%02d %02d:%02d:%02d UTC", 1900 + tm.tm_year, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec );
#else
  // print local time
  time64_to_tm( ts.tv_sec, -sys_tz.tz_minuteswest * 60, &tm );
  return snprintf( buffer, buffer_len, "%ld-%02d-%02d %02d:%02d:%02d", 1900 + tm.tm_year, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec );
#endif
}
#endif


///////////////////////////////////////////////////////////
// ufsd_printk
//
// Used to show different messages (errors and warnings)
///////////////////////////////////////////////////////////
void UFSDAPI_CALLv
ufsd_printk(
    IN struct super_block  *sb,
    IN const char *fmt, ...
    )
{
  va_list va;
  struct va_format vaf;
  const char *comm = current->comm;
  bool bInfo = '<' == fmt[0] && '6' == fmt[1] && '>' == fmt[2];

  va_start( va, fmt );

  vaf.fmt = bInfo? (fmt + 3) : fmt; // skip "<6>"
  vaf.va  = &va;

  printk_ratelimited( bInfo
                      ? KERN_INFO QUOTED_UFSD_DEVICE ": \"%s\" (%s): %pV\n"
                      : KERN_CRIT QUOTED_UFSD_DEVICE ": \"%s\" (%s): %pV\n",
                       comm, sb? sb->s_id : "", &vaf );

  va_end( va );

#if defined UFSD_TRACE && !defined UFSD_ANDROID_KMI_DENIED
  //
  // Duplicate error in log file (if not default)
  //
  if ( log_file && !( current->flags & (PF_MEMALLOC|PF_KSWAPD) ) ) {
    //
    // rebuild 'vaf'
    //
    va_start( va, fmt );
    vaf.fmt = bInfo? (fmt + 3) : fmt; // skip "<6>"
    vaf.va  = &va;
    ufsd_trace( "\"%s\" (%s): %pV", comm, sb? sb->s_id : "", &vaf );
    va_end( va );
  }
#endif
}


#ifdef UFSD_DEBUG

///////////////////////////////////////////////////////////
// ufsd_dump_stack
//
// Sometimes it is useful to call this function from library
///////////////////////////////////////////////////////////
UFSDAPI_CALL void
ufsd_dump_stack( void )
{
  dump_stack();
}


static long ufsd_trace_level_Old;
///////////////////////////////////////////////////////////
// ufsd_turn_on_trace_level
//
//
///////////////////////////////////////////////////////////
UFSDAPI_CALL void
ufsd_turn_on_trace_level( void )
{
  ufsd_trace_level_Old = ufsd_trace_level;
  ufsd_trace_level = -1;
}


///////////////////////////////////////////////////////////
// ufsd_revert_trace_level
//
//
///////////////////////////////////////////////////////////
void UFSDAPI_CALL
ufsd_revert_trace_level( void )
{
  ufsd_trace_level  = ufsd_trace_level_Old;
}


///////////////////////////////////////////////////////////
// is_zero
//
//
///////////////////////////////////////////////////////////
int
is_zero(
    IN const char *data,
    IN size_t     bytes
    )
{
  if ( !(((size_t)data)%sizeof(int)) ) {
    while( bytes >= sizeof(int) ) {
      if ( *(int*)data )
        return 0;
      bytes -= sizeof(int);
      data  += sizeof(int);
    }
  }

  while( bytes-- ) {
    if ( *data++ )
      return 0;
  }
  return 1;
}

#if 0
#include <linux/pagemap.h>
#include <linux/buffer_head.h>
#include <linux/pagevec.h>

bool assert_byte(struct address_space *mapping, loff_t vbo, u16 val)
{
  bool ok;
  unsigned off;
  u8 *d;
  u16 v;
  pgoff_t index = vbo >> PAGE_SHIFT;
  struct page *page = find_get_page(mapping, index);

  if (NULL == page) {
    DebugTrace( 0, 0, ("no page at %lx", index));
    return 0 == val;
  }

  d = kmap(page);
  off = vbo & (PAGE_SIZE - 1);
  v = ((*(d + off)) << 8) | (*(d + off + 1));

  if (val != v) {
    //dbg(0, "val=%x,mem=%x", val, *(u16*)(d + off));
    off = (vbo & ~0xf) & (PAGE_SIZE - 1);
    ok = false;
    ufsdapi_dump_memory(Add2Ptr(d, off), 0x10);
  } else {
    DebugTrace( 0, 0, ("mem[%llx]=%x - ok", vbo, val));
    ok = true;
  }
  kunmap(page);
  put_page(page);
  return ok;
}

///////////////////////////////////////////////////////////
// ufsd_trace_page_buffers
//
//
///////////////////////////////////////////////////////////
void
ufsd_trace_page_buffers(
    IN struct page  *page,
    IN int          hdr
    )
{
  if ( hdr ) {
    DebugTrace(+1, UFSD_LEVEL_PAGE_RW, ("p=%pK f=%lx:\n", page, page->flags ));
  } else if ( ufsd_trace_level & UFSD_LEVEL_PAGE_RW ) {
    ufsd_trace_inc( +1 );
  }

  if ( page_has_buffers( page ) ) {
    struct buffer_head *head  = page_buffers(page);
    struct buffer_head *bh    = head;
    char*d = kmap( page );

    do {
      int zero = is_zero( d + bh_offset( bh ), bh->b_size );
      if ( (sector_t)-1 == bh->b_blocknr ) {
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("bh=%pK,%lx%s\n", bh, bh->b_state, zero? ", z":"") );
      } else {
        DebugTrace( 0, UFSD_LEVEL_PAGE_RW, ("bh=%pK,%lx,%"PSCT"x%s\n", bh, bh->b_state, bh->b_blocknr, zero? ", z":"" ) );
      }
      bh = bh->b_this_page;
    } while( bh != head );

    kunmap( page );
  } else {
    DebugTrace(0, UFSD_LEVEL_PAGE_RW, ("no buffers\n" ));
  }

  if ( ufsd_trace_level & UFSD_LEVEL_PAGE_RW )
    ufsd_trace_inc( -1 );
}


u32 trace_pages(struct address_space *mapping)
{
  struct folio_batch fbatch;
  pgoff_t index = 0;
  u32 ret = 0;

//  static_assert(0x20000 == (1u << PG_mappedtodisk));

  folio_batch_init(&fbatch);

  for (;;) {
    unsigned int nr, i;

    nr = filemap_get_folios(mapping, &index, -1, &fbatch);
    if (!nr)
      break;

    for (i = 0; i < nr; i++) {
      struct folio *folio = fbatch.folios[i];
      struct page *page = &folio->page;
      void *d;

      folio_lock(folio);
      if (folio->mapping != mapping) {
        folio_unlock(folio);
        continue;
      }

      d = kmap(page);

      DebugTrace( 0, 0, ("p=%pK o=%llx f=%lx%s", page,
          (u64)page->index << PAGE_SHIFT, page->flags,
          is_zero(d, PAGE_SIZE) ? ", zero" : ""));
      if (mapping->host->i_ino == 0x1b && 1 == page->index)
        ufsdapi_dump_memory(Add2Ptr(d, 0x380), 0x80);
      ufsd_trace_page_buffers(page, 0);
      kunmap(page);
      ret += 1;

      folio_unlock(folio);
    }
    folio_batch_release(&fbatch);
    cond_resched();
  }

  if (!ret)
    DebugTrace( 0, 0, ("no pages"));
  return ret;
}


///////////////////////////////////////////////////////////
// trace_page
//
//
///////////////////////////////////////////////////////////
void
trace_page(
    IN struct address_space *mapping,
    IN pgoff_t index
    )
{
  void *d;
  struct page *page = find_get_page(mapping, index);

  if (NULL == page) {
    DebugTrace( 0, 0, ("no page at %lx\n", index));
    return;
  }

  d = kmap(page);

  DebugTrace( 0, 0, ("p=%pK o=%llx f=%lx%s\n", page, (UINT64)page->index << PAGE_SHIFT, page->flags, is_zero( d, PAGE_SIZE )?", zero" : "" ));
  ufsd_trace_page_buffers(page, 0);
  kunmap(page);
  //  BUG_ON(PageDirty(page));

  put_page(page);
}


///////////////////////////////////////////////////////////
// ufsd_drop_pages
//
//
///////////////////////////////////////////////////////////
void
ufsd_drop_pages(
    IN struct address_space *m
    )
{
  filemap_fdatawrite( m );
  unmap_mapping_range( m, 0, 0, 1 );
  truncate_inode_pages( m, 0 );
  unmap_mapping_range( m, 0, 0, 1 );
}


#if 0
#include <linux/bio.h>

struct bio_batch {
  atomic_t          done;
  unsigned long     flags;
  unsigned long     error;
  struct completion *wait;
};

static void bio_end_io( struct bio *bio )
{
  struct bio_batch *bb = bio->bi_private;

  if ( bio->bi_status && (bio->bi_status != BLK_STS_NOTSUPP) )
    bb->error = bio->bi_status;

  if ( atomic_dec_and_test( &bb->done ) )
    complete( bb->wait );

  bio_put( bio );
}


///////////////////////////////////////////////////////////
// ufsd_bd_check
//
///////////////////////////////////////////////////////////
int
UFSDAPI_CALL
ufsd_bd_check(
    IN struct super_block *sb
    )
{
  int err;
  struct bio_batch bb;
  struct page *page = alloc_page( GFP_KERNEL | __GFP_ZERO );
  struct bio *bio;
  struct block_device *bdev = sb->s_bdev;
#ifdef DECLARE_COMPLETION_ONSTACK
  DECLARE_COMPLETION_ONSTACK( wait );
#else
  DECLARE_COMPLETION( wait );
#endif

  if ( !page )
    return -ENOMEM;

  atomic_set( &bb.done, 1 );
  err       = 0;
  bb.flags  = 0;
  bb.wait   = &wait;

  bio = Bio_alloc( bdev, GFP_NOFS|__GFP_HIGH, 1 );
  if ( !bio ) {
    err = -ENOMEM;
    goto out;
  }

  bio->bi_iter.bi_sector = 0x64001000 >> 9;
  bio_set_dev(bio, bdev);

  bio->bi_end_io  = bio_end_io;
  bio->bi_private = &bb;

  {
    char* kmap = Kmap_atomic( page );
    memset( kmap, -1, PAGE_SIZE );
    Kunmap_atomic( kmap );
  }

  bio_add_page( bio, page, 0x200, 0 );

  atomic_inc( &bb.done );
  bio_set_op_attrs( bio, READ, 0 );
  submit_bio( bio )

  if ( !atomic_dec_and_test( &bb.done ) )
    wait_for_completion( &wait );

  err = 0;
  {
    unsigned char* kmap = Kmap_atomic( page );
    ufsdapi_dump_memory( kmap, 0x80 );
    Kunmap_atomic( kmap );
  }

out:
  __free_page( page );
  return err;
}
#endif
#endif


#if 0
char ufsd_heap_check_on;

///////////////////////////////////////////////////////////
// ufsd_heap_check
//
//
///////////////////////////////////////////////////////////
void
UFSDAPI_CALL
ufsd_heap_check( void )
{
  struct list_head *pos;

  dump_stack();

  list_for_each( pos, &TotalAllocHead )
  {
    size_t o;
    memblock_head *block = list_entry( pos, memblock_head, Link );
    const char  *hint = ufsd_check_block_mem( block, &o );
    if ( hint ) {
      DebugTrace( 0, UFSD_LEVEL_ERROR, ("**** seq=%x: size 0x%x  asize 0x%x", block->seq, block->size, block->asize ));
      DebugTrace( 0, UFSD_LEVEL_ERROR, ("**** heap_check: %pK %s barrier failed at 0x%zx", block + 1, hint, o ));
      BUG_ON(1);
    }
  }
}
#endif

#endif // #ifdef UFSD_DEBUG
