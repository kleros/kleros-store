import app from './app'

import config from '../config'

const { PORT = 3000 } = process.env
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)) // eslint-disable-line no-console
