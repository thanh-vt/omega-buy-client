class ApiUtil {
  static handleError(error: any): { code: string, description: string } {
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('Error', error.response.data);
      return error.response.data;
      // console.log(error.response.status);
      // console.log(error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log('Error', error.request);
      return {code: '9999', description: 'Cannot receive response from server'};
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log('Error', error.message);
      return {code: '9999', description: 'Cannot send request to server'};
    }
  }
}

export default ApiUtil;
