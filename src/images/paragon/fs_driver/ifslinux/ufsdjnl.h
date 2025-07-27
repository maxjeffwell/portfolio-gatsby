/////////////////////////////////////////////////////////////////////////////
//
// Filesystem journal-writing code for HFS+ (based on jbd2 implementation in Kernel).
//
// Copyright (c) 2012-2019 Paragon Software Group, All rights reserved.
//
/////////////////////////////////////////////////////////////////////////////
//
// This file is under the terms of the GNU General Public License, version 2.
// http://www.gnu.org/licenses/gpl-2.0.html
//
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
//
/////////////////////////////////////////////////////////////////////////////////

void ufsd_wait_on_page_writeback(struct page *page);

#ifdef UFSD_CFI_SLOWPATH
#ifdef CONFIG_CFI_PERMISSIVE
void ufsd_cfi_slowpath_diag(uint64_t id, void *ptr, void *diag);
void ufsd_ubsan_handle_cfi_check_fail(void *data, void *ptr, void *vtable);
#else
void ufsd_cfi_slowpath(uint64_t id, void *ptr, void *diag);
void ufsd_ubsan_handle_cfi_check_fail_abort(void *data, void *ptr, void *vtable);
#endif
#endif

#ifdef CONFIG_LOCKDEP
void ufsd_debug_check_no_locks_held(void);
#endif

#ifdef CONFIG_DEBUG_LOCK_ALLOC
void ufsd_mutex_lock_nested(struct mutex *, unsigned int);
#endif

void mutex_destroy_jnl(struct mutex *lock);
int debug_lockdep_rcu_enabled_jnl(void);
ssize_t ufsd_write_sync(struct kiocb *iocb, ssize_t count);

extern struct user_namespace *ufsd_ns;


#ifdef UFSD_SMART_DIRTY_SEC
// included from ufsdvfs.c


#ifdef UFSD_CFI_SLOWPATH
#ifdef CONFIG_CFI_PERMISSIVE
void __cfi_slowpath_diag(uint64_t id, void *ptr, void *diag)
{
  ufsd_cfi_slowpath_diag(id, ptr, diag);
}

void __ubsan_handle_cfi_check_fail(void *data, void *ptr, void *vtable)
{
  ufsd_ubsan_handle_cfi_check_fail(data, ptr, vtable);
}
#else

void __cfi_slowpath(uint64_t id, void *ptr, void *diag)
{
  ufsd_cfi_slowpath(id, ptr, diag);
}

void __ubsan_handle_cfi_check_fail_abort(void *data, void *ptr, void *vtable)
{
  ufsd_ubsan_handle_cfi_check_fail_abort(data, ptr, vtable);
}
#endif
#endif

#ifdef CONFIG_LOCKDEP
void debug_check_no_locks_held(void)
{
  ufsd_debug_check_no_locks_held();
}
#endif

#ifdef CONFIG_DEBUG_LOCK_ALLOC
void mutex_lock_nested(struct mutex *lock, unsigned int subclass)
{
  ufsd_mutex_lock_nested(lock, subclass);
}
#endif

#else

// included from ufsdjnl.c

void ufsd_wait_on_page_writeback(struct page *page)
{
  wait_on_page_writeback(page);
}
EXPORT_SYMBOL( ufsd_wait_on_page_writeback );

#ifdef UFSD_CFI_SLOWPATH
#ifdef CONFIG_CFI_PERMISSIVE
void __cfi_slowpath_diag(uint64_t id, void *ptr, void *diag);
void ufsd_cfi_slowpath_diag(uint64_t id, void *ptr, void *diag)
{
  __cfi_slowpath_diag(id, ptr, diag);
}
EXPORT_SYMBOL( ufsd_cfi_slowpath_diag );

void __ubsan_handle_cfi_check_fail(void *data, void *ptr, void *vtable);
void ufsd_ubsan_handle_cfi_check_fail(void *data, void *ptr, void *vtable)
{
  __ubsan_handle_cfi_check_fail(data, ptr, vtable);
}
EXPORT_SYMBOL( ufsd_ubsan_handle_cfi_check_fail );
#else
void __cfi_slowpath(uint64_t id, void *ptr, void *diag);
void ufsd_cfi_slowpath(uint64_t id, void *ptr, void *diag)
{
  __cfi_slowpath(id, ptr, diag);
}
EXPORT_SYMBOL( ufsd_cfi_slowpath );

void __ubsan_handle_cfi_check_fail_abort(void *data, void *ptr, void *vtable);
void ufsd_ubsan_handle_cfi_check_fail_abort(void *data, void *ptr, void *vtable)
{
  __ubsan_handle_cfi_check_fail_abort(data, ptr, vtable);
}
EXPORT_SYMBOL( ufsd_ubsan_handle_cfi_check_fail_abort );
#endif
#endif

#ifdef CONFIG_LOCKDEP
void ufsd_debug_check_no_locks_held(void)
{
  debug_check_no_locks_held();
}
EXPORT_SYMBOL( ufsd_debug_check_no_locks_held );
#endif

#ifdef CONFIG_DEBUG_LOCK_ALLOC
void ufsd_mutex_lock_nested(struct mutex *lock, unsigned int subclass)
{
  mutex_lock_nested(lock, subclass);
}
EXPORT_SYMBOL( ufsd_mutex_lock_nested );
#endif

struct user_namespace *ufsd_ns = &init_user_ns;
EXPORT_SYMBOL( ufsd_ns );

#endif
