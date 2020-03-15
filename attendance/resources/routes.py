from .attendance import AllAttendanceApi, AttendanceApi

def initialize_routes(api):
    api.add_resource(AllAttendanceApi, '/api/attendance')
    api.add_resource(AttendanceApi, '/api/attendance/<id>')