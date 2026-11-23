def publish_suppliers(offers, required):
    verified = [offer for offer in offers if offer["verified"]]
    if all(any(item in offer["items"] for offer in verified) for item in required):
        return [offer["id"] for offer in verified]
    return None
