
#! /bin/bash

while getopts "p:" opt; do
	case ${opt} in
		p )
			PROJECT_DIR=${OPTARG}
			;;
	esac
done

# Establish symbolic links for the following directories:
# the environment folder
rm __environment
mkdir -p ../environment/${PROJECT_DIR}
ln -s ../environment/${PROJECT_DIR} __environment
# the media folder
rm media
ln -s ../media/${PROJECT_DIR} media
# the account folder
rm account
ln -s ../accounts/${PROJECT_DIR} account
# the favicon folder
rm favicon
ln -s ../media/${PROJECT_DIR}/favicon favicon

# -/-/-/-/-
# Set up all the scheduled tasks
# -/-/-/-/-
# Set permissive permission
chmod 744 */scheduled-task*
chmod 744 setup/scheduled-tasks/*.{sh,php,js}

# Build a cumulative, consolidated crontab
CURRENT_WORKING_DIR=`pwd`
CRON_ENV="\n\nPATH=/bin:/usr/bin:/usr/local/bin:${CURRENT_WORKING_DIR}\nHOME=${CURRENT_WORKING_DIR}\n";
find -type f -name '*.crontab' -exec cat {} \; > tmp_crontab;
printf $CRON_ENV | cat - tmp_crontab | tee tmp_2_crontab;
rm tmp_crontab;
mkdir -p setup;
mv tmp_2_crontab setup/scheduled-tasks/all_tasks.crontab;
cp setup/scheduled-tasks/all_tasks.crontab __environment/scheduled-tasks/$PROJECT_DIR.crontab
cat __environment/scheduled-tasks/*.crontab | crontab -
