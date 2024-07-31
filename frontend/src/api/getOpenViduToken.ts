 /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The method below request the creation of a token to
   * your application server. This prevents the need to expose
   * your LiveKit API key and secret to the client side.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints. In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   */

export default async function getOpenViduToken(APPLICATION_SERVER_URL:string, roomName: string, participantName: string) {
  // const data = {
  //   token: 'token',
  // };

  // await axios({
  //   method: 'get',
  //   url: `${APPLICATION_SERVER_URL}/lives/token/1`,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: {
  //     roomName: roomName,
  //     participantName: participantName,
  //   },
  // })
  //   .then((res) => {
  //     data.token = res.data.token;
  //   })
  //   .catch((err) => {
  //     new Error(`Failed to get token: ${err.errorMessage}`);
  //   });

  const response = await fetch(APPLICATION_SERVER_URL + 'token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomName: roomName,
      participantName: participantName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get token: ${error.errorMessage}`);
  }

  const data = await response.json();

  return data.token;
}