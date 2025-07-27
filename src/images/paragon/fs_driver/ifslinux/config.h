/* ifslinux/config.h.  Generated from config.h.in by configure.  */
/* ifslinux/config.h.in.  Generated from configure.in by autoheader.  */

/* (int (*mkdir)(struct mnt_idmap *, struct inode *, struct dentry *,
   umode_t); */
#define HAVE_DECL_MKDIR_V1 1

/* (struct dentry * (*mkdir)(struct mnt_idmap *, struct inode *, struct dentry
   *, umode_t); */
/* #undef HAVE_DECL_MKDIR_V2 */

/* Define to 1 if you have the declaration of `PG_error', and to 0 if you
   don't. */
#define HAVE_DECL_PG_ERROR 1

/* int (*write_begin) (struct file *, struct address_space *, loff_t,
   unsigned, struct page **, void **); */
#define HAVE_DECL_WRITE_BEGIN_V1 1

/* int (*write_begin) (struct file *, struct address_space *, loff_t,
   unsigned, struct folio**, void **); */
/* #undef HAVE_DECL_WRITE_BEGIN_V2 */

/* Define to 1 if `bd_mapping' is a member of `struct block_device'. */
#define HAVE_STRUCT_BLOCK_DEVICE_BD_MAPPING 1

/* Define to the address where bug reports for this package should be sent. */
#define PACKAGE_BUGREPORT ""

/* Define to the full name of this package. */
#define PACKAGE_NAME "ufsd"

/* Define to the full name and version of this package. */
#define PACKAGE_STRING "ufsd UFSD_HEAD"

/* Define to the one symbol short name of this package. */
#define PACKAGE_TARNAME "ufsd"

/* Define to the home page for this package. */
#define PACKAGE_URL ""

/* Define to the version of this package. */
#define PACKAGE_VERSION "UFSD_HEAD"

/* PSCT l */
#define PSCT "ll"

/* Define to 1 if you have the ANSI C header files. */
#define STDC_HEADERS 1

/* SetPageError macro helper */
/* #undef SetPageError */

/* APFS Using flag */
/* #undef UFSD_APFS */

/* BTRFS Using flag */
/* #undef UFSD_BTRFS */

/* EXFAT Using flag */
/* #undef UFSD_EXFAT */

/* FAT Using flag */
/* #undef UFSD_FAT */

/* HFS Using flag */
#define UFSD_HFS /**/

/* NTFS Using flag */
#define UFSD_NTFS /**/

/* Refs1 Using flag */
/* #undef UFSD_REFS1 */

/* Refs3 Using flag */
/* #undef UFSD_REFS3 */

/* Refs3.4 Using flag */
/* #undef UFSD_REFS34 */

/* TEXFAT Using flag */
/* #undef UFSD_TEXFAT */

/* XFS Using flag */
/* #undef UFSD_XFS */

/* bd_mapping */
/* #undef bd_mapping */

/* HAVE_DECL_ helper macro */
#define is_decl( __HD ) ( defined HAVE_DECL_ ## __HD && HAVE_DECL_ ## __HD )

/* HAVE_STRUCT_ helper macro */
#define is_struct( __HS ) ( defined HAVE_STRUCT_ ## __HS && HAVE_STRUCT_ ## __HS )
