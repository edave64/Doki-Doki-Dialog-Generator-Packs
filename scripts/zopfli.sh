optipng *.png
mkdir z
zopflipng --prefix=z/ *.png
mv -f ./z/* ./
rmdir z
