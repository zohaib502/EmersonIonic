@ECHO OFF

set file=6.14.4.1.txt
set bucket=emerson-app-update
set resource="/%bucket%/dev/%file%"
set contentType="text/plain"
set dateValue=`date -R`
set stringToSign="PUT\n\n%contentType%\n%dateValue%\n%resource%"
set s3Key=xxxxxxxxxxxxxxxxxxxx
set s3Secret=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
set signature=`echo -en %stringToSign% | openssl sha1 -hmac %s3Secret% -binary | base64`
curl -X PUT -T "%file%" \
  -H "Host: %bucket%.s3.amazonaws.com" \
  -H "Date: %dateValue%" \
  -H "Content-Type: %contentType%" \
  -H "Authorization: AWS %s3Key%:%signature%" \
  https://%bucket%.s3.amazonaws.com/%file%