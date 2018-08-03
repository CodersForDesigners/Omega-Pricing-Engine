
#! /bin/bash

while getopts "p:" opt; do
	case ${opt} in
		p )
			PROJECT_DIR=${OPTARG}
			;;
	esac
done

# Establish symbolic links to the `media`, `data` and `account` directories
rm media
ln -s ../media/${PROJECT_DIR} media
rm account
ln -s ../accounts/${PROJECT_DIR} account
