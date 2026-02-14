Add images to raw/ folder

then run:

npm run optimize
ls -t photos | grep -E '\.(JPG|jpg|jpeg|png)$' | jq -R . | jq -s . > photos.json'
ls -t photos | grep -E '\.(JPG|jpg|jpeg|png)$' | jq -R . | jq -s . > photos.json

git add .
git commit -m "Add new photos"
git push


temporarily check website:
npx serve
