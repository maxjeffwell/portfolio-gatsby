########################################################################
# Helper functions
########################################################################

# try-run
# Usage: option = $(call try-run, $(CC)...-o "$$TMP",option-ok,otherwise)
# Exit code chooses option. "$$TMP" is can be used as temporary file and
# is automatically cleaned up.
try-run = $(shell set -e;               \
        TMP="$(TMPOUT).$$$$.tmp";       \
        TMPO="$(TMPOUT).$$$$.o";        \
        if ($(1)) >/dev/null 2>&1;      \
        then echo "$(2)";               \
        else echo "$(3)";               \
        fi;                             \
        rm -f "$$TMP" "$$TMPO")

# cc-option
# Usage: cflags-y += $(call cc-option,-march=winchip-c6,-march=i586)
cc-option = $(call try-run,\
        $(CC) $(1) -c -x c /dev/null -o "$$TMP",$(1),$(2))

# cc-disable-warning
# Usage: cflags-y += $(call cc-disable-warning,unused-but-set-variable)
cc-disable-warning = $(call try-run,\
        $(CC) -Werror -W$(strip $(1)) -c -x c$(2) /dev/null -o "$$TMP",-Wno-$(strip $(1)))

ifeq ($(shell $(CC) -v 2>&1 | grep -c "clang version"), 1)
	COMPILER := clang
else
	COMPILER := gcc
endif

EXT_MODULE_FLAGS_ = $(EXT_MODULE_FLAGS)

ifdef src
    src := $(src)/
endif

retail ?= 0

#Module
MODULE_SRC := ifslinux
ifeq (0,1)
MODULE_NAME := ufsd_debug
else
MODULE_NAME := ufsd
endif

ifeq (1,1)
ifeq (0,1)
MODULE_NAME2 := jnl_debug
else
MODULE_NAME2 := jnl
endif
endif

hostprogs-y := $(MODULE_SRC)/crc32_calc
hostprogs := $(MODULE_SRC)/crc32_calc

MODULE_LIBNAME := libufsd
MODULE_OBJECTS := $(MODULE_SRC)/ufsdvfs.o $(MODULE_SRC)/vfsdebug.o $(MODULE_SRC)/config_check.o

MODULE_EXTRA_FLAGS := -include $(src)$(MODULE_SRC)/fs_conf.h -DUFSD_DEVICE=ufsd -DUFSD_USE_ASM_DIV64
ifeq (0,1)
MODULE_EXTRA_FLAGS += -DUFSD_DEBUG -g3 -ggdb3
LDFLAGS   += -d
else
MODULE_EXTRA_FLAGS += -DNDEBUG -g0
#In some cases -x breaks exports
#LDFLAGS   += -s -O2 -d -x -X
LDFLAGS   += -s -O2 -d -X
endif

ifeq (1,1)
MODULE_EXTRA_FLAGS += -include $(src)drv_config.h
endif

ifeq (0,1)
    MODULE_EXTRA_FLAGS += -DUFSD_TRACE
endif

ifeq (1,0)
    MODULE_EXTRA_FLAGS += -DUFSD_NO_PRINTK
endif

ifndef CONFIG_UFSD_FS
    CONFIG_UFSD_FS = m
endif

ifeq ($(CLANG_CROSS_COMPILE),)
	MODULE_OBJECTS += $(MODULE_SRC)/$(MODULE_LIBNAME).o
else
	ifneq ($(src),)
		MODULE_LIB_OBJ=$(shell ( cd $(src) ; ar vx "/home/maxjeffwell/Downloads/paragon/fs_driver/ifslinux/objfre/libufsd_x86_64.bin"  | sed 's/x - //') )
		MODULE_OBJECTS += $(MODULE_LIB_OBJ)
	endif
endif
$(MODULE_NAME)-objs := $(MODULE_OBJECTS)
$(MODULE_NAME)-y := $(MODULE_OBJECTS)

ifeq (1,1)
$(MODULE_NAME2)-objs := $(MODULE_SRC)/ufsdjnl.o
$(MODULE_NAME2)-y    := $(MODULE_SRC)/ufsdjnl.o
obj-m := $(MODULE_NAME2).o $(MODULE_NAME).o
else
obj-m := $(MODULE_NAME).o
endif

## Add diagnostic module
#kdiag-objs := $(MODULE_SRC)/kdiag.o
#kdiag-y := $(MODULE_SRC)/kdiag.o
#obj-m += kdiag.o

ifeq ($(shell test -e /etc/host_extracflags && echo -n yes), yes)
HOST_EXTRACFLAGS += $(shell cat /etc/host_extracflags)
endif
ccflags-y += $(MODULE_EXTRA_FLAGS)
ccflags-y += -Wall -Werror -Wno-unknown-pragmas
ccflags-y += $(call cc-disable-warning,expansion-to-defined)

ifdef PACKAGE_TAG
ccflags-y += "-DPACKAGE_TAG=\"$(PACKAGE_TAG)\""
endif

ifeq ($(COMPILER), clang)
	EXT_MODULE_FLAGS_ += $(call cc-disable-warning,unused-label)
	EXT_MODULE_FLAGS_ += $(call cc-disable-warning,unused-variable)
	EXT_MODULE_FLAGS_ += $(call cc-disable-warning,frame-address)
endif
EXT_MODULE_FLAGS_ += $(call cc-disable-warning,date-time)

ifdef EXT_MODULE_FLAGS_
	ccflags-y += $(EXT_MODULE_FLAGS_)
endif

SKIP_STACK_VALIDATION := 1
export SKIP_STACK_VALIDATION

ccflags-y += -include $(obj)/$(MODULE_SRC)/hash_val.h

ifeq "$(retail)" "1"
ccflags-y += -DUFSD_RETAIL_JNL
endif

$(obj)/$(MODULE_SRC)/ufsdjnl.o: $(obj)/$(MODULE_SRC)/hash_val.h
$(obj)/$(MODULE_SRC)/ufsdvfs.o: $(obj)/$(MODULE_SRC)/hash_val.h
$(obj)/$(MODULE_SRC)/vfsdebug.o: $(obj)/$(MODULE_SRC)/hash_val.h

$(obj)/$(MODULE_SRC)/config_check.o: $(obj)/$(MODULE_SRC)/hash_val.h

$(obj)/$(MODULE_SRC)/hash_val.h: $(obj)/$(MODULE_SRC)/crc32_calc
	$(shell echo "extern char ufsd_hash_check_result[];"     >  $(obj)/$(MODULE_SRC)/hash_val.h)
	$(shell echo "extern void ufsd_check_config_hash(void);" >> $(obj)/$(MODULE_SRC)/hash_val.h)
	$(shell echo "#define UFSD_HASH_VAL_H" >> $(obj)/$(MODULE_SRC)/hash_val.h)
ifeq ($(shell test -e /lib/modules/6.11.0-28-generic/build/.config && echo -n yes), yes)
	$(if $(shell $(obj)/$(MODULE_SRC)/crc32_calc /lib/modules/6.11.0-28-generic/build/.config),@echo "Calculated hash of Kernel .config: `$(obj)/$(MODULE_SRC)/crc32_calc /lib/modules/6.11.0-28-generic/build/.config`",@echo "crc32_calc doesn't work")
	$(if $(shell $(obj)/$(MODULE_SRC)/crc32_calc /lib/modules/6.11.0-28-generic/build/.config),$(shell echo "#define UFSD_KCONFIG_HASH_VAL `$(obj)/$(MODULE_SRC)/crc32_calc /lib/modules/6.11.0-28-generic/build/.config`" >> $(obj)/$(MODULE_SRC)/hash_val.h),$(shell echo "#undef UFSD_KCONFIG_HASH_VAL" >> $(obj)/$(MODULE_SRC)/hash_val.h))
else
	@echo "Hash not calculated because config was not found"
	$(shell echo "#undef UFSD_KCONFIG_HASH_VAL" >> $(obj)/$(MODULE_SRC)/hash_val.h)
endif

.PHONY: clean driver driver_install driver_uninstall

clean:
	# rename *.a and *.so libs to *.a.ufsd and *.so.ufsd so kernel's "make clean" won't delete them
	@if [ -d linutil/objfre ]; then for file in $(wildcard linutil/objfre/*.a) $(wildcard linutil/objfre/*.so); do mv -n $$file $$file.ufsd; done; fi
	@$(MAKE) -C "/lib/modules/6.11.0-28-generic/build" M="/home/maxjeffwell/Downloads/paragon/fs_driver" clean 2>&1 > /dev/null
	# and rename them back
	@if [ -d linutil/objfre ]; then for file in $(wildcard linutil/objfre/*.a) $(wildcard linutil/objfre/*.so); do mv -n $$file.ufsd $$file; done; fi
	@/usr/bin/rm -f "$(src)$(MODULE_SRC)/$(MODULE_LIBNAME).o"
	@/usr/bin/rm -f "$(src)$(MODULE_SRC)"/*.ur-safe
	@/usr/bin/rm -f *.dbg
	@[ -f $(src)$(MODULE_SRC)/hash_val.h ] && /usr/bin/rm $(MODULE_SRC)/hash_val.h || /usr/bin/true

-include $(TOPDIR)/Rules.make

$(MODULE_NAME).ko:
	@ln -s -f "/home/maxjeffwell/Downloads/paragon/fs_driver/ifslinux/objfre/libufsd_x86_64.bin" "$(src)$(MODULE_SRC)/$(MODULE_LIBNAME).o"
	touch "$(src)$(MODULE_SRC)/.$(MODULE_LIBNAME).o.cmd"
	@$(MAKE) -C "/lib/modules/6.11.0-28-generic/build" M="/home/maxjeffwell/Downloads/paragon/fs_driver" $(CLANG_CROSS_COMPILE) O="/lib/modules/6.11.0-28-generic/build" modules V=1 2>&1

driver:$(MODULE_NAME).ko
	/usr/bin/objcopy --only-keep-debug ufsd.ko ufsd.ko.dbg
	/usr/bin/strip -g --strip-unneeded ufsd.ko
	-/usr/bin/strip -g --strip-unneeded ufsd.ko
	-/usr/bin/objcopy --add-gnu-debuglink=ufsd.ko.dbg ufsd.ko

ifeq (1,1)
install_commands := /sbin/modprobe -qr $(MODULE_NAME) 2>&1 > /dev/null ;
install_commands += /usr/bin/mkdir -p /lib/modules/6.11.0-28-generic/kernel/external/ufsd 2>&1 ;
install_commands += /usr/bin/cp -f $(MODULE_NAME).ko /lib/modules/6.11.0-28-generic/kernel/external/ufsd 2>&1 ;
ifeq (1,1)
install_commands += /sbin/modprobe -qr $(MODULE_NAME2) 2>&1 > /dev/null ;
install_commands += /usr/bin/cp -f $(MODULE_NAME2).ko /lib/modules/6.11.0-28-generic/kernel/external/ufsd 2>&1 ;
endif
install_commands += /sbin/depmod -a 2>&1 ;
install_commands += /sbin/modprobe $(MODULE_NAME) 2>&1 ;

driver_install: $(MODULE_NAME).ko
ifeq ($(shell /usr/bin/id -u),0)
	@$(install_commands)
else
	@echo -e "\033[33mEnter Root password to install driver\033[0m"
	@/usr/bin/su -c "$(install_commands)"
endif

uninstall_commands := /sbin/modprobe -qr $(MODULE_NAME) 2>&1 ;
ifeq (1,1)
uninstall_commands += /sbin/modprobe -qr $(MODULE_NAME2) 2>&1 > /dev/null ;
endif
uninstall_commands += /usr/bin/rm -Rf /lib/modules/6.11.0-28-generic/kernel/external/ufsd 2>&1 ;
uninstall_commands += /sbin/depmod -a 2>&1 ;

driver_uninstall:
ifeq ($(shell /usr/bin/id -u),0)
	@$(uninstall_commands)
else
	@echo -e "\033[33mEnter Root password to uninstall driver\033[0m"
	@/usr/bin/su -c "$(uninstall_commands)"
endif
endif
