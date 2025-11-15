import { User } from "./user.model";

// Basé sur Announcement.java [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/model/Announcement.java]
export interface Announcement {
    id: number;
    title: string;
    description: string;
    type: 'DONATION' | 'SALE';
    quantity: number;
    foodType: string;
    expiryDate: string; 
    pickupTime: string; 
    address: string;
    imageUrl: string;
    moderationStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    donor: User;
    
    offers?: any[];
}