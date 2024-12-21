import json
import random

print('Python on')

# 讀取 words.json 文件
with open('public/JSON_Data/WordTable.json', 'r') as file:
    data = json.load(file)

print(type(data))

# 隨機選擇7個單字組成句子
words = [item["Vocabulary"] for item in data['sentence']]
sentence = ' '.join(random.sample(words, 7))

# 將句子新增到新文件的 JSON 中
new_data = {'words': []}
output_file = 'public/JSON_Data/sentence.json'

# 如果文件已存在，先讀取其內容，再做新增
try:
    with open(output_file, 'r') as file:
        new_data = json.load(file)
except FileNotFoundError:
    pass

# 添加新句子
new_data['words'].append(sentence.capitalize())

# 寫回到sentence.json
with open(output_file, 'w') as file:
    json.dump(new_data, file, indent=4)
