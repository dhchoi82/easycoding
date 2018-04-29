#!/usr/bin/python3

'''
인자로 설정된 변수를 JSON 파일에 저장하는 함수
'''
def setJsonFile(variable):
    from json import dumps # JSON 문자열 생성 함수
    from os import rename # 파일 이름 수정 함수
    from time import time # 현재 시각 timestamp 반환 함수
    fileTemplate = '../docs/contents/languageTopicList{}.json'
    
    try:
        # 기존 JSON 설정 파일의 이름을 변경
        rename(fileTemplate.format(''),fileTemplate.format('_{0:.2f}'.format(time())))
    except:
        pass
    
    # 입력된 변수의 JSON 변환 문자를 JSON 설정 파일에 저장
    with open(fileTemplate.format(''), 'w') as jsonFile:
        jsonFile.write(dumps(variable))

from sqlite3 import connect
from hashlib import md5

with connect('../src/easycoding.sqlite') as conn:
    jsonVar = [] # JSON 문자로 변환될 변수 원형 선언
    
    cur = conn.cursor()
    sql = 'SELECT name FROM languages ORDER BY id' # 프로그래밍 언어 목록 선택 sql
    cur.execute(sql)
        
    for (lang,) in cur.fetchall():
        jsonLangVar = {'lang': lang, 'topics': []} # JSON 문자로 변환될 언어별 변수 원형 선언
        
        sql = "SELECT title, content FROM languages LEFT JOIN topics ON languages.id = topics.langId WHERE name is '{}' ORDER BY topics.id".format(lang) # 해당 언어의 자료 목록 선택 sql
        cur.execute(sql)
        
        for title, content in cur.fetchall():
            if title is not None:
                filePath = 'contents/{}/{}'.format(lang.lower(),md5(title.encode('utf-8')).hexdigest()) # web page에서 사용될 파일 경로 생성
                jsonLangVar['topics'].append({'title': title, 'file': filePath}) # 자료 이름과 자료 내용 파일 경로를 JSON 문자열 변환 변수에 저장
                open('../docs/'+filePath,'w').write(content)
        
        jsonVar.append(jsonLangVar) # JSON 문자로 변환될 언어별 변수 추가
    
    setJsonFile(jsonVar) # JSON 설정 파일 생성
