import { User } from "./user.model";

// Basé sur Announcement.java [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/model/Announcement.java]
export interface Announcement {
    id: number;
    title: string;
    description: string;
    type: 'DONATION' | 'SALE'; // [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/enums/AnnouncementType.java]
    quantity: number;
    foodType: string;
    expiryDate: string; // (format ISO, ex: "2025-11-20")
    pickupTime: string; // (format ISO, ex: "2025-11-12T10:00:00")
    address: string;
    imageUrl: string;
    moderationStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'; // [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/enums/ModerationStatus.java]
    createdAt: string;
    donor: User; // L'objet User (Merchant) qui a posté

    // --- CORRECTION ---
    // Ajoutez cette ligne. Elle était manquante dans votre fichier.
    offers?: any[];
}