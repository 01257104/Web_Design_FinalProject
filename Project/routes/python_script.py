import json
import random

# 讀取 words.json 文件
with open('WordTable.json', 'r') as file:
    data = json.load(file)

# 隨機選擇 7 個單詞組成句子
words = [item['Vocabulary'] for item in data]
sentence = ' '.join(random.sample(words, 7))

# 將句子追加到新文件的 JSON 中
new_data = {'words': []}
output_file = '../public/JSON_Data/words.json'

# 如果文件已存在，先讀取其內容
try:
    with open(output_file, 'r') as file:
        new_data = json.load(file)
except FileNotFoundError:
    pass

# 添加新句子
new_data['words'].append(sentence)

# 寫回到文件
with open(output_file, 'w') as file:
    json.dump(new_data, file, indent=4)

# 輸出句子（回傳給前端）
print(sentence)
