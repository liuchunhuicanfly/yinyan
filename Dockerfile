FROM python:3.7
ADD requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

RUN mkdir -p /yingyan
COPY . /yingyan
WORKDIR /yingyan

RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

CMD ["python", "app.py"]
