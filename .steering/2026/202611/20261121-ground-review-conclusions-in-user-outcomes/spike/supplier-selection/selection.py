def select_supplier(offers, required):
    verified = [offer for offer in offers if offer["verified"]]
    if all(any(item in offer["items"] for offer in verified) for item in required):
        return min(verified, key=lambda offer: offer["price"])["id"]
    return None
