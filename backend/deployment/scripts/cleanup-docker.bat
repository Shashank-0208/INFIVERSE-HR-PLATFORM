@echo off
echo Cleaning Docker build cache...
docker builder prune --all --force
echo.
echo Cleaning unused containers...
docker container prune -f
echo.
echo Cleaning unused images...
docker image prune -a -f
echo.
echo Docker cleanup complete!
pause
