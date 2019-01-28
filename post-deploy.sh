
#! /bin/bash

while getopts "p:" opt; do
	case ${opt} in
		p )
			PROJECT_DIR=${OPTARG}
			;;
	esac
done

# Establish symbolic links for the following directories:
# the media folder
rm media
ln -s ../media/${PROJECT_DIR} media
# the configuration folder
rm configuration
ln -s ../configuration/${PROJECT_DIR} configuration
# the account folder
rm account
ln -s ../accounts/${PROJECT_DIR} account
# the favicon folder
rm favicon
ln -s ../media/${PROJECT_DIR}/favicon favicon
# the logs folder
rm logs
ln -s ../data/${PROJECT_DIR}/logs logs


# Set up all the scheduled tasks with cron
chmod 744 setup/import-pricing-sheet.php
php setup/import-pricing-sheet.php > logs/import-pricing-sheet.log 2>&1

CURRENT_WORKING_DIR=`pwd`
HOME=${CURRENT_WORKING_DIR}/logs
CRON_ENV="\n\nPATH=/bin:/usr/bin:/usr/local/bin:${CURRENT_WORKING_DIR}/setup\nHOME=${HOME}\n";
printf $CRON_ENV | cat - setup/tasks.crontab | tee tmp__crontab;
rm setup/tasks.crontab;
mv tmp__crontab setup/tasks.crontab;
cp setup/tasks.crontab ../cronjobs/$PROJECT_DIR.crontab
cat ../cronjobs/*.crontab | crontab -
