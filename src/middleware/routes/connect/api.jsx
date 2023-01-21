import EnvM from '@/envMachetero'
import fetch from 'isomorphic-fetch'

const envM = EnvM()

const baseRute = envM.hostBackProto

const request = async ({ json = {}, method = 'POST', rute = '' }) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const raw = JSON.stringify(json);
  const requestOptions = {
    method,
    headers: myHeaders,
    redirect: 'follow'
  };
  if (method !== 'GET') {
    requestOptions.body = raw;
  }
  try {
    const response = await fetch(`${baseRute}${rute}`, requestOptions);
    const result = await response.json();

    if (result) {
      return result
    }

  } catch (error) {
    console.log('error', error);
    return error
  }
}

export const getMsj = async () => {
  const respond = await request({
    method: 'GET',
    rute: '/message'
  });
  if (respond) {
    return respond
  }

}
export const getCompanies = async () => {
  const respond = await request({
    method: 'GET',
    rute: '/companies'

  });
  if (respond) {
    return respond
  }

}
export const getHistorial = async () => {
  const respond = await request({
    method: 'GET',
    rute: '/historial'

  });
  if (respond) {
    return respond
  }

}
export const deltMsj = async () => {
  const respond = await request({
    method: 'DELETE',
    rute: '/message'

  });
  if (respond) {
    return respond
  }

}
export const putMsj = async (msj) => {
  const respond = await request({
    json: {
      'type': 'add',
      'msj': msj
    },
    method: 'PUT',
    rute: '/message'

  });
  if (respond) {
    return respond
  }

}
export const putHistorial = async (msj) => {
  const respond = await request({
    json: {
      'type': 'historial',
      'msj': msj
    },
    method: 'PUT',
    rute: '/message'

  });
  if (respond) {
    return respond
  }
}
export const createPage = async (msj) => {
  const respond = await request({
    json: {
      'type': 'create',
      'msj': {
        'name': msj.name,
        'password': msj.password,
        'color': msj.color,
        'sections': msj.sections,
        'logo': msj.logoSrc
      },
    },
    method: 'PUT',
    rute: '/message'

  });
  if (respond) {
    return respond
  }

}
export const login = async (msj) => {
  const respond = await request({
    json: {
      'user': msj.user,
      'password': msj.password
    },
    method: 'POST',
    rute: '/message'

  });
  if (respond) {
    return respond
  }

}