for f in *.png
do
	cwebp -lossless "$f" -o "${f%.*}.webp"
done 
