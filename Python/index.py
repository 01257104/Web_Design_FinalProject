import json
import os

# 要新增的字串
new_word = "Hello World!"

# 檔案路徑
file_path = '../Project/public/html/words.json'

# 檢查檔案是否存在
if not os.path.exists(file_path):
    print(f"檔案 {file_path} 不存在")
else:
    # 讀取現有的 JSON 檔案
    with open(file_path, 'r') as file:
        data = json.load(file)

    # 把新的字串加到 "words" 陣列裡
    data["words"].append(new_word)

    # 將更新後的資料寫回到同一個 JSON 檔案
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

    print("字串已成功新增到 words 陣列")
