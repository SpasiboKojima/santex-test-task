export function returnSuccessResponse(data: Object) {
  return {
    code: 200,
    success: true,
    message: 'Success',
    ...data,
  }
}
