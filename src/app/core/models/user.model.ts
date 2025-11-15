// [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/enums/ERole.java]
export enum ERole {
  BENEFICIARY = 'BENEFICIARY',
  MERCHANT = 'MERCHANT',
  ASSOCIATION = 'ASSOCIATION',
  ADMIN = 'ADMIN'
}

// [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/model/User.java]
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  location: string; // Ajouté
  phoneNumber: string; // Ajouté
  verificationDocumentUrl: string; // Ajouté
  createdAt: string; // Ajouté
  isValidated: boolean; // Ajouté (du backend)
  
  // Champ bonus pour l'UI (géré par le service)
  status?: 'Pending' | 'Approved' | 'Rejected'; 
}