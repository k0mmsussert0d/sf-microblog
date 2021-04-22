from typing import Any, List


def extract_attribute(
        attributes: List[dict],
        attr_name: str,
        key: str = 'Name',
        value: str = 'Value',
        default: Any = None
) -> Any:
    try:
        return list(filter(lambda x: x.get(key) == attr_name, attributes))[0].get(value)
    except IndexError:
        return default
