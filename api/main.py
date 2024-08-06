import requests
from dotenv import load_dotenv
import os

load_dotenv()


def make_github_req(url, additional_headers={}):
    github_auth_token = os.getenv("GITHUB_TOKEN")
    headers = {
        "Authorization": "Bearer " + github_auth_token,
        "X-GitHub-Api-Version": "2022-11-28",
        **additional_headers,
    }

    r = requests.get(url, headers=headers)
    return r


result = make_github_req("https://api.github.com/octocat")
print(result.text)
