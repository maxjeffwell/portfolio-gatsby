#!/bin/bash

if [ -z "$BASH_VERSION" ]; then
	echo >&2 "This script requires 'bash' shell"
	exit 1
fi

if [ "$(echo -e TEST)" = "-e TEST" ]; then
	IS_POSIX=1
fi

if [ -f modulename ] && [ -s modulename ]; then
	modulename=$(cat modulename)
	if [ -n "${modulename//[-_[:alnum:]]/}" ]; then
		echo >&2 "Bad characters in modulename: $modulename"
		exit 1
	fi
else
	modulename=ufsd
fi

if module_ext=$(find "/lib/modules/$(uname -r)/" -type f -name "*.ko*" | grep -m 1 -oE '\.ko\.([gx]z|zst)$'); then
	module_ext=${module_ext#.}
else
	module_ext="ko"
fi

LP="$PWD"
D_VER='head'
D_PREF="paragon-$modulename"

fecho()
{
	if [ "$1" = "COL" ]; then
		shift
		color="$1"
		shift
	fi
	if [ -z "$IS_POSIX" ]; then
		echo -e "\\033[${color}m$*\\033[0m"
	else
		echo "$*"
	fi
}

if [ "$(id -u)" -ne 0 ]; then
	fecho COL 31 "Not enough permissions to uninstall. Please login as root."
	exit 1
fi

if awk '{print $3}' /proc/mounts | grep -q "^$modulename$"; then
	fecho COL 31 "Some drives are mounted with UFSD driver. You can abort and unmount"
	fecho COL 31 "them manually or continue without taking any action."
	fecho COL 31 "If you continue, reboot is required after uninstallation"
	fecho COL 31 "for correct UFSD driver removal. [abort/continue]"
	read -r answer
	case "$answer" in
	[aA]|[aA][bB][oO][rR][tT])
		exit 1
		;;
	esac
fi

fecho COL 33 "Uninstalling driver"

if [ -f Makefile ]; then
	/usr/bin/make driver_uninstall
fi

rm -f /etc/modules-load.d/${D_PREF}.conf

if [ -f /etc/modules ]; then
	# we need to delete 'jnl' only from line before $modulename
	# (in case multiple versions are installed)
	if grep -q "^$modulename$" /etc/modules; then
		unset is_jnl
		modules=''

		while IFS='' read -r line; do
			if [ "$line" = jnl ]; then
				is_jnl=1
			else
				if [ "$line" != "$modulename" ]; then
					if [ -n "$is_jnl" ]; then
						modules+=$'jnl\n'
					fi
					modules+="$line"$'\n'
				fi
				unset is_jnl
			fi
		done < /etc/modules

		echo -n "$modules" > /etc/modules
	fi
fi

rmmod "$modulename" 2>/dev/null

if [ -f ifslinux/ufsdjnl.c ]; then
	# we should delete jnl.ko from directories where ONLY jnl and $modulename exists (no other modules exist in directory)
	find "/lib/modules/$(uname -r)/" -name "$modulename"."$module_ext" \
		-execdir bash -c "[ \"\$( find . -maxdepth 1 -type f | wc -l )\" -eq 2 ] && rm -f jnl.$module_ext" \;

	# if there is a directory with more than 2 modules we must backup jnl.ko
	find "/lib/modules/$(uname -r)/" -name "$modulename"."$module_ext" \
		-execdir bash -c "[ \"\$( find . -maxdepth 1 -type f | wc -l )\" -gt 2 ] && [ -f jnl.$module_ext ] && cp jnl.$module_ext jnl_bak.$module_ext" \;

	# unload jnl only if there are no other ones
	if [ -z "$(find "/lib/modules/$(uname -r)/" -name jnl.$module_ext)" ]; then
		rmmod jnl 2>/dev/null
	fi
fi

if [ -d "/usr/src/${D_PREF}-${D_VER}" ]; then
	dkms uninstall -m ${D_PREF} -v "${D_VER}"    >  dkms-uninstall.log 2>&1
	dkms remove -m ${D_PREF} -v "${D_VER}" --all >> dkms-uninstall.log 2>&1
	rm -rf "/usr/src/${D_PREF}-${D_VER}"
	rm -rf "/var/lib/dkms/${D_PREF}"
	rm -f {/usr/lib,/lib}/modules/*/kernel/{fs,external}/$modulename/jnl.{ko,$module_ext}
	rm -f {/usr/lib,/lib}/modules/*/kernel/{fs,external}/$modulename/$modulename.{ko,$module_ext}
fi

find "/lib/modules/$(uname -r)/" -name "$modulename"."$module_ext" \
	-execdir rm -f $modulename.$module_ext jnl.$module_ext \;

if [ -f ifslinux/ufsdjnl.c ]; then
	# restore backuped jnl.ko
	find "/lib/modules/$(uname -r)/" -name jnl_bak.$module_ext \
		-execdir mv jnl_bak.$module_ext jnl.$module_ext \;
fi

depmod -a

if [ -x "$(which systemctl 2>/dev/null)" ] && [ -x "$(which lsinitrd 2>/dev/null)" ]; then
	if lsinitrd | grep -q "$modulename.ko"; then
		dracut -fq
	fi
fi


fecho COL 33 "Driver uninstalled!"

if [ -f util/mount.paragon-ufsd ]; then
	fecho COL 33 "Removing automount scripts"

	paths="$(readlink -e /sbin)"$'\n'"$(readlink -e /usr/sbin)"

	for p in $(echo "$paths" | sort -u); do
		for fs in mount.ntfs mount.hfsplus; do
			if [ -f "$p/$fs.bak" ]; then
				rm -f "$p/$fs"
				mv "$p/$fs.bak" "$p/$fs"
			fi
			if [ -s "$p/$fs" ] && [ "$(readlink -m "$p/$fs")" = '/usr/sbin/mount.paragon-ufsd' ]; then
				rm -f "$p/$fs"
			fi
		done
	done

	rm -f /usr/sbin/mount.paragon-ufsd

fi

if [ -d linutil ]; then
	if [ -d "/usr/src/${D_PREF}-${D_VER}/linutil/" ]; then
		util_list=$(ls /usr/src/${D_PREF}-${D_VER}/linutil/ | grep  -E '^mk' | tr '\n' ' ' |  tr '[:lower:]' '[:upper:]'  | sed -e 's/MK\|\.CPP//g; s/\ /\//g; s/\/$//g')
	else
		util_list=$(ls linutil/ | grep  -E '^mk' | tr '\n' ' ' |  tr '[:lower:]' '[:upper:]'  | sed -e 's/MK\|\.CPP//g; s/\ /\//g; s/\/$//g')
	fi
	if [ -n "${util_list}" ]; then
		fecho COL 33 "Would you like to uninstall ${util_list} utilities? [yes/no]"
	else
		fecho COL 33 "Would you like to install UFSD utilities? [yes/no]"
	fi
	read -r answer
	case "$answer" in
		[yY]|[yY][eE][sS])
			if [ -d /usr/src/${D_PREF}-${D_VER}/linutil/ ]; then
				cd "/usr/src/${D_PREF}-${D_VER}/linutil/" &&
				/usr/bin/make remove
				cd "$LP" || exit 1
			else
				cd linutil/ &&
				/usr/bin/make remove
			fi

			fecho COL 33 "${util_list} utilities uninstalled!"
		;;
	esac
fi

