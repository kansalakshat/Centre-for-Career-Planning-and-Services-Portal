import * as Brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(0, process.env.BREVO_API_KEY);

export default apiInstance;
