from main import get_repos_by_stars


def test_get_reposby_stars():
    search = get_repos_by_stars(min_stars=10, first=1)

    # should return total count
    assert isinstance(search["repositoryCount"], int)
    assert search["repositoryCount"] > 1

    # should contain pagination
    assert isinstance(search["pageInfo"], dict)

    # should contain required fields
    assert isinstance(search["edges"], list)
    assert list(search["edges"][0]["node"].keys()) == [
        "id",
        "databaseId",
        "name",
        "stargazerCount",
        "primaryLanguage",
        "owner",
        "isFork",
        "forkCount",
        "diskUsage",
        "pushedAt",
        "createdAt",
        "updatedAt",
        "archivedAt",
        "url",
    ]

    # after token should work
    next_search = get_repos_by_stars(
        min_stars=10, first=1, after=search["pageInfo"]["endCursor"]
    )
    assert len(next_search["edges"]) == 1
