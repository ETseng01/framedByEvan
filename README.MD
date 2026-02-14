This is the first file in my portfolio

rm photos/*

npm run optimize

ls -t photos | grep -E '\.(JPG|jpg|jpeg|png)$' | jq -R . | jq -s . > photos.json
