#!/bin/bash

if [ -z "$BASH_VERSION" ]; then
	echo >&2 "This script requires 'bash' shell"
	exit 1
fi

shopt -s nullglob

if [ "$(echo -e TEST)" = '-e TEST' ]; then
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

LP="$PWD"
D_VER='head'
D_PREF="paragon-$modulename"

if module_ext=$(find "/lib/modules/$(uname -r)/" -type f -name "*.ko*" | grep -m 1 -oE '\.ko\.[gx]z$'); then
	module_ext=${module_ext#.}
else
	module_ext="ko"
fi

cleanup()
{
	requested_ret="${1}"
	failed_ret=""

	if [ -n "$other_jnls" ]; then
		fecho >&2 "Restoring previously saved jnl.ko modules"
		echo "$other_jnls" | while read -r old_jnl; do
			mv "${old_jnl}.bak" "$old_jnl"
		done
	fi

	if [ -n "$other_ufsd" ]; then
		modprobe jnl 2>/dev/null
		if [ "${?}" -ne "0" ]; then
			fecho >&2 COL 31 "Failed to load jnl.ko module, try dmesg | tail for details"
			failed_ret="1"
		fi
		# shellcheck disable=SC2086
		modprobe $other_ufsd
		if [ "${?}" -ne "0" ]; then
			fecho >&2 COL 31 "Failed to load $other_ufsd.ko module, try dmesg | tail for details"
			failed_ret="1"
		fi
	fi

	if [ -n "${failed_ret}" ]; then
		exit "${failed_ret}"
	else
		exit "${requested_ret}"
	fi
}

fail()
{
	fecho >&2 COL 31 "Error: $*"
	cleanup 1
}

trap 'fail Interrupted' INT HUP TERM

fecho()
{
	local color
	if [ "$1" = 'COL' ]; then
		shift
		color="$1"
		shift
	fi
	if [ -z "$IS_POSIX" ] && [ -n "$color" ]; then
		echo -e "\\033[${color}m$*\\033[0m" | tee -a "$LP/paragon-ufsd-install.log"
	else
		echo "$*" | tee -a "$LP/paragon-ufsd-install.log"
	fi
}

fancy()
{
	echo '=======\/\/\/=======' "$*" '=======\/\/\/=======' >> "$LP/paragon-ufsd-install.log"
}

print_version_error()
{
	fecho COL 31 "Current kernel version is out of supported range. Proceed at your own risk? [Yes/no]"
	read -r answer
	case "$answer" in
	[nN]|[nN][oO])
		fail "Aborted"
		;;
	esac
}

run_install_driver()
{
	fecho COL 31 "Continue installing? [yes/no/read]."
	read -r answer
	case "$answer" in
	[yY]|[yY][eE][sS])
		;;
	[rR]|[rR][eE][aA][dD])
		less License.txt
		run_install_driver
		return $?
		;;
	*)
		return 1
		;;
	esac

	echo "================= UFSD install log ===================" > "$LP/paragon-ufsd-install.log"
	echo "Start: $(date)" >> "$LP/paragon-ufsd-install.log"
	echo "OS Version: $(uname -a)" >> "$LP/paragon-ufsd-install.log"

	# check kernel version
	min_version="6.7"
	max_version="6.14"
	curr_version=$( uname -r | cut -d. -f'1 2' )

	if [ $( printf '%s\n' ${min_version} ${curr_version} | sort -V | head -n 1 ) != "${min_version}" ]; then # less than min
		print_version_error
	elif [ $( printf '%s\n' ${max_version} ${curr_version} | sort -V | tail -n 1 ) != "${max_version}" ]; then # higher than max
		print_version_error
	fi

	# end check kernel version

	if awk '{print $3}' /proc/mounts | grep -q "^$modulename$"; then
		fecho COL 31 "Some drives are mounted with previous version of UFSD driver."
		fecho COL 31 "You can abort installation and unmount them manually or continue"
		fecho COL 31 "without taking any action. If you continue, reboot is required"
		fecho COL 31 "after installation for correct UFSD driver update."
		fecho COL 31 "[abort/continue]"
		read -r answer
		case "$answer" in
		[aA]|[aA][bB][oO][rR][tT])
			fail "Aborted"
			;;
		esac
	fi

	fecho COL 32 "Searching and removing previously installed UFSD driver in /lib/modules/$(uname -r)/"

	rmmod "$modulename" 2>/dev/null

	if [ -f ifslinux/ufsdjnl.c ]; then
		has_jnl=1
		find "/lib/modules/$(uname -r)/" -name "$modulename"."$module_ext" \
			-execdir rm -f jnl.$module_ext \;
		rmmod jnl 2>/dev/null
		# save other jnl.ko's (if exist) to be overwritten with newer version later
		other_jnls=$(find "/lib/modules/$(uname -r)/" /var/lib/dkms/*/*/"$(uname -r)/" \
			\( \! -path "/var/lib/dkms/${D_PREF}/*" -a -name jnl.$module_ext \) \
			-print -exec mv '{}' '{}.bak' \;)

		if [ -n "$other_jnls" ]; then
			fecho COL 31 "jnl.ko modules from other UFSD packages were found:"
			fecho "$other_jnls"
			fecho COL 31 "Those modules will be overwritten with new version during installation."
		fi

		other_ufsd=$(lsmod | grep '^jnl\s' | awk '{print $(NF)}' | sed 's/,/\n/g' | grep -v "^$modulename$")

		if [ -n "$other_ufsd" ]; then
			other_ufsd=${other_ufsd//$'\n'/ }
			fecho COL 31 "Module(s) '$other_ufsd' will be temporarily unloaded."
		fi

		if [ -n "$other_jnls" ] || [ -n "$other_ufsd" ]; then
			fecho COL 31 "[abort/continue]"
			read -r answer
			case "$answer" in
			[aA]|[aA][bB][oO][rR][tT])
				fail "Aborted"
				;;
			esac
		fi

		if [ -n "$other_ufsd" ]; then
			# shellcheck disable=SC2086
			if ! rmmod $other_ufsd jnl >> "$LP/paragon-ufsd-install.log" 2>&1; then
				fecho COL 31 "Could not unload '$other_ufsd' and 'jnl' modules"
				fecho COL 31 "Try to unmount all volumes mounted by '$other_ufsd'"
				fail "rmmod failed"
			fi
		fi
	else
		unset has_jnl
	fi

	find "/lib/modules/$(uname -r)/" -name "$modulename"."$module_ext" -delete

	#################################################################################################
	# Next options such as dkms support and additional utilities are available in Professional      #
	# version only.                                                                                 #
	# Please consider buying Paragon NTF/HFS+ for Linux Professional if you want to make them work. #
	# http://www.paragon-software.com/home/ntfs-linux-professional/                                 #
	#################################################################################################

	if [ -f util/paragon-dkms.conf ]; then
		unset no_dkms
		fecho COL 33 "Would you like UFSD driver to rebuild after kernel updates? [yes/no]"
		read -r answer
		case "$answer" in
		[yY]|[yY][eE][sS])
			if ! which dkms >/dev/null 2>&1; then
				fail "Please install dkms package first"
			else
				rm -rf "/usr/src/${D_PREF}-${D_VER}"
				rm -rf "/var/lib/dkms/${D_PREF}/"

				if [ -x "$(which systemctl 2>/dev/null)" ]; then
					dkms_service=$(systemctl list-unit-files 2>/dev/null | grep -m 1 -oE 'dkms(_autoinstaller)?\.service')
					if [ -n "$dkms_service" ] && ! systemctl status "$dkms_service" | grep -q -w active; then
						fecho COL 31 "Service $dkms_service is inactive. Driver may not be rebuilt with kernel updates."
						fecho COL 31 "To enable the service, execute following commands:"
						fecho COL 31 "sudo systemctl start $dkms_service"
						fecho COL 31 "sudo systemctl enable $dkms_service"
					fi
				fi

				fecho COL 32 "Setting DKMS configuration"
				mkdir "/usr/src/${D_PREF}-${D_VER}/"
				cp -r ./ "/usr/src/${D_PREF}-${D_VER}/"
				mv "/usr/src/${D_PREF}-${D_VER}/util/paragon-dkms.conf" "/usr/src/${D_PREF}-${D_VER}/dkms.conf"
				sed -i "s/\\<ufsd\\>/$modulename/g" "/usr/src/${D_PREF}-${D_VER}/dkms.conf"
				dkms add -m ${D_PREF} -v "${D_VER}" >> "$LP/paragon-ufsd-install.log"

				fecho COL 32 "Preparing to install"
				dkms build -m ${D_PREF} -v "${D_VER}" >> "$LP/paragon-ufsd-install.log"
				dkms_ret=$?



				if [ $dkms_ret -ne 0 ]; then
					fancy 'DKMS make log'
					cat "/var/lib/dkms/${D_PREF}/${D_VER}/build/make.log" >> "$LP/paragon-ufsd-install.log"
					fancy 'DKMS make log'
					fancy 'DMESG'
					dmesg | tail -n 250 >> "$LP/paragon-ufsd-install.log"
					fancy 'DMESG'
					fail "Can't prepare driver configuration"
				else
					fancy 'DKMS make log'
					cat "/var/lib/dkms/${D_PREF}/${D_VER}/$(uname -r)/$(uname -m)/log/make.log" >> "$LP/paragon-ufsd-install.log"
					fancy 'DKMS make log'
				fi

				fecho COL 32 "Building and installing driver to kernel $(uname -r)"
				if ! dkms install --force -m ${D_PREF} -v "${D_VER}" >> "$LP/paragon-ufsd-install.log"; then
					fail "Can't build driver"
				fi

				fecho COL 32 "Driver was installed to system"
			fi
			;;
		*)
			no_dkms=1
			;;
		esac
	else
		no_dkms=1
	fi

	if [ -n "$no_dkms" ]; then
		fecho COL 32 "Preparing to install"

		[ -f Makefile ] && make clean >> "$LP/paragon-ufsd-install.log"

		if ! ./configure --with-modulename="$modulename" >> "$LP/paragon-ufsd-install.log" 2>&1; then
			fancy 'Configure log'
			cat "config.log" >> "$LP/paragon-ufsd-install.log"
			fancy 'Configure log'
			fail "Can't prepare driver configuration"
		else
			fancy 'Configure log'
			cat "config.log" >> "$LP/paragon-ufsd-install.log"
			fancy 'Configure log'
		fi

		fecho COL 32 "Building driver to kernel $(uname -r)"

		if ! make driver retail=1 >> "$LP/paragon-ufsd-install.log" 2>&1; then
			fail "Can't build driver"
		fi

		fecho COL 32 "Install driver to kernel $(uname -r)"

		if ! make driver_install >> "$LP/paragon-ufsd-install.log" 2>&1; then
			fail "Can't install driver"
		fi

		fecho COL 32 "Driver was installed to system"
	fi

	if [ -n "$other_jnls" ]; then
		fecho COL 32 "Updating previously existing jnl.ko modules"
		new_jnl=$(find "/lib/modules/$(uname -r)/" -name jnl.$module_ext | head -n 1)
		if [ -z "$new_jnl" ]; then
			new_jnl=$(find /var/lib/dkms/${D_PREF}/${D_VER}/$(uname -r)/$(uname -m)/ -name jnl.$module_ext)
		fi
		echo "$other_jnls" | while read -r old_jnl; do
			if [ "$old_jnl" != "$new_jnl" ] && [ -n "$old_jnl" ] && [ -n "$new_jnl" ]; then
				cp -v "$new_jnl" "$old_jnl" >> "$LP/paragon-ufsd-install.log" 2>&1
			fi
			rm -f "${old_jnl}.bak"
		done
		unset other_jnls
	fi

	if [ -x "$(which systemctl 2>/dev/null)" ]; then
		fecho COL 32 "Setting driver autoload at system startup"
		rm -f /etc/modules-load.d/${D_PREF}.conf
		if [ -n "$has_jnl" ]; then
			echo jnl > /etc/modules-load.d/${D_PREF}.conf
		fi
		echo "$modulename" >> /etc/modules-load.d/${D_PREF}.conf
	fi

	if [ -f /etc/modules ] && ! grep -q "^$modulename$" /etc/modules; then
		fecho COL 32 "Setting driver autoload at system startup"
		if [ -n "$has_jnl" ]; then
			echo jnl >> /etc/modules
		fi
		echo "$modulename" >> /etc/modules
	fi

	if [ -f util/mount.paragon-ufsd ]; then
		fecho COL 33 "Would you like to mount NTFS/HFS+ volumes with UFSD driver automatically? [yes/no]"
		read -r answer
		case "$answer" in
		[yY]|[yY][eE][sS])
			# automount script always has same name regardless of $modulename,
			# because it's pointless to create multiple ones
			cp util/mount.paragon-ufsd  /usr/sbin/
			chown root:root /usr/sbin/mount.paragon-ufsd
			chmod 04755 /usr/sbin/mount.paragon-ufsd

			# ...but contents depend on $modulename
			sed -i "s/-t ufsd /-t $modulename /g" /usr/sbin/mount.paragon-ufsd

			paths="$(readlink -e /sbin)"$'\n'"$(readlink -e /usr/sbin)"

			for p in $(echo "$paths" | sort -u); do
				for fs in mount.ntfs mount.hfsplus; do
					if [ -f "$p/$fs" ] && [ ! "$(readlink -m "$p/$fs")" = '/usr/sbin/mount.paragon-ufsd' ]; then
						mv -n "$p/$fs" "$p/$fs.bak"
					fi
					ln -sf /usr/sbin/mount.paragon-ufsd "$p/$fs"
				done
			done
			fecho COL 32 "Automount configured"
			;;
		esac
	fi

	if [ -d linutil ]; then	
		if [ -d "/usr/src/${D_PREF}-${D_VER}/linutil/" ]; then
			util_list=$(ls /usr/src/${D_PREF}-${D_VER}/linutil/ | grep  -E '^mk' | tr '\n' ' ' |  tr '[:lower:]' '[:upper:]'  | sed -e 's/MK\|\.CPP//g; s/\ /\//g; s/\/$//g')
		else
			util_list=$(ls linutil/ | grep  -E '^mk' | tr '\n' ' ' |  tr '[:lower:]' '[:upper:]'  | sed -e 's/MK\|\.CPP//g; s/\ /\//g; s/\/$//g')
		fi
		if [ -n "${util_list}" ]; then
			fecho COL 33 "Would you like to install ${util_list} utilities? [yes/no]"
		else
			fecho COL 33 "Would you like to install UFSD utilities? [yes/no]"
		fi
		read -r answer
		case "$answer" in
		[yY]|[yY][eE][sS])
			if [ -d "/usr/src/${D_PREF}-${D_VER}/linutil/" ]; then
				cd "/usr/src/${D_PREF}-${D_VER}/linutil/" || fail "cd failed"
			else
				cd "linutil/" || fail "cd failed"
			fi

			fecho COL 32 "Making ${util_list} utilities"

			if ! make retail_util >> "$LP/paragon-ufsd-install.log" 2>&1; then
				fail "Can't make utilities"
			fi

			fecho COL 32 "Installing ${util_list} utilities"

			if ! make install_retail >> "$LP/paragon-ufsd-install.log" 2>&1; then
				fail "Can't install utilities"
			fi

			fecho COL 32 "${util_list} utilities installed"

			ntfs3g_present="0"
			ntfs3g_path=""
			for i in $( which -a mkntfs ); do
  				if exec "${i}" --help 2>&1 | grep -qi "tuxera"; then
    				ntfs3g_present="1"
    				ntfs3g_path="${ntfs3g_path} ${i}"
  				fi
			done

			if [ "${ntfs3g_present}" -eq "1" ]; then
  				fecho COL 31 "Mkntfs utility from ntfs-3g package found: ${ntfs3g_path}."
  				fecho COL 31 "Keep in mind that it can override UFSD's mkntfs utility execution."
  				fecho COL 31 "To avoid this behavior it is highly recommended to uninstall ntfs-3g package."
			fi
			
			cd "$LP" || fail "cd failed"
			;;
		esac
	fi

	fecho COL 32 "Installation complete!"
}

if echo "$LP" | grep -q -e : -e '\s'; then
	fecho COL 31 "Path to current work directory '$LP' contains invalid character."
	fail "Installation was aborted."
fi

if [ "$(id -u)" -ne 0 ]; then
	fail "Not enough permissions to install. Please login as root."
fi

fecho COL 31 "By installing this software you accept the terms of End User License Agreement listed in License file."
run_install_driver

cleanup 0

