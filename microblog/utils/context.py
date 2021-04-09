def get_user_data(event):
    return event['requestContext']['authorizer']['jwt']['claims']
