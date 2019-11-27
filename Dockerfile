FROM python:3.7
WORKDIR /workspace/yingyan

COPY requirements.txt ./
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

CMD ["python", "app.py"]
