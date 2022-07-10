import { Controller, Get, Query, Req, Res } from '@nestjs/common'
import axios, {AxiosResponse} from 'axios'
import {Request, Response} from 'express'

interface AuthCallbackData {
  code: string
}

interface TokenCallbackData {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
  token_type: string
}

@Controller('auth')
export class PatreonController {
  @Get('callback')
  public async authCallback(@Query() data: AuthCallbackData, @Req() request: Request, @Res() response: Response) {
    const {code} = data
    const grantType = 'authorization_code'
    const clientId = process.env.PATREON_OAUTH_CLIENT_ID
    const clientSecret = process.env.PATREON_OAUTH_CLIENT_SECRET
    const redirectUri = `${request.protocol}://${request.get('host')}/auth/callback`

    const tokenResponse = await axios.postForm<TokenCallbackData>('https://www.patreon.com/api/oauth2/token', {
      grant_type: grantType,
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).catch(err => {
      const errorResponse = err.response as AxiosResponse
      console.error('response', errorResponse.data)
    })

    if (!tokenResponse) {
      response.status(500).send('An error occured while trying to authenticate with Patreon')
      return
    }

    const clientRedirectUrl = `${process.env.CLIENT_ENDPOINT}`

    return response
      .cookie('access_token', tokenResponse.data.access_token)
      .cookie('refresh_token', tokenResponse.data.refresh_token)
      .cookie('expires_in', tokenResponse.data.expires_in)
      .cookie('token_type', tokenResponse.data.token_type)
      .redirect(clientRedirectUrl)
  }
}
