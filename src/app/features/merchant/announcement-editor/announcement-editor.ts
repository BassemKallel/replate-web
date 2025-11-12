import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common'; // <-- Pipes
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement';
@Component({
  selector: 'app-announcement-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TitleCasePipe, DatePipe], 
  templateUrl: './announcement-editor.html',
  styleUrls: ['./announcement-editor.css']
})
export class AnnouncementEditorComponent implements OnInit {

  announcementForm!: FormGroup;
  editId: string | null = null; // Pour RDT-6
  isLoading = false;
  errorMessage: string | null = null;
  imageFileName: string | null = null;
  
  // --- CORRECTION ---
  // 'private' a été supprimé pour que le template HTML puisse y accéder
  selectedFile: File | null = null;
  // --- FIN CORRECTION ---

  categories: string[] = ['Boulangerie', 'Fruits & Légumes', 'Produits Laitiers', 'Plats Cuisinés', 'Épicerie'];
  types: ('DONATION' | 'SALE')[] = ['DONATION', 'SALE'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private announcementService: AnnouncementService,
    private datePipe: DatePipe // Injecter DatePipe
  ) {}

  ngOnInit(): void {
    // Initialise le formulaire
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['DONATION', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      foodType: [this.categories[0], Validators.required],
      expiryDate: ['', Validators.required], // Format yyyy-MM-dd
      pickupTime: ['', Validators.required], // Format yyyy-MM-ddTHH:mm
      address: ['', Validators.required],
      imageFile: [null] // N'est pas requis pour la modification
    });

    // Vérifie si on est en mode ÉDITION (RDT-6)
    // /announcement-editor/:id
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.loadAnnouncementForEdit(this.editId);
    }
  }

  /**
   * (RDT-6) Charge les données de l'annonce dans le formulaire
   */
  loadAnnouncementForEdit(id: string): void {
    this.isLoading = true;
    this.announcementService.getAnnouncementById(id).subscribe(ann => {
      this.announcementForm.patchValue({
        title: ann.title,
        description: ann.description,
        type: ann.type,
        quantity: ann.quantity,
        foodType: ann.foodType,
        address: ann.address,
        // Formate les dates pour les inputs HTML
        expiryDate: this.datePipe.transform(ann.expiryDate, 'yyyy-MM-dd'),
        pickupTime: this.datePipe.transform(ann.pickupTime, 'yyyy-MM-ddTHH:mm'),
      });
      // Affiche le nom de l'image existante
      this.imageFileName = ann.imageUrl; 
      this.isLoading = false;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.imageFileName = this.selectedFile.name;
    }
  }

  /**
   * (RDT-5 & RDT-6) Soumet le formulaire
   */
  onSubmit(): void {
    if (this.announcementForm.invalid) {
      this.errorMessage = "Veuillez remplir tous les champs requis.";
      return;
    }
    
    // Une image est requise seulement en mode Création
    if (!this.editId && !this.selectedFile) {
      this.errorMessage = "Une image est requise pour créer une annonce.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Construit le FormData
    const formData = new FormData();
    formData.append('title', this.announcementForm.get('title')?.value);
    formData.append('description', this.announcementForm.get('description')?.value);
    formData.append('type', this.announcementForm.get('type')?.value);
    formData.append('quantity', this.announcementForm.get('quantity')?.value.toString());
    formData.append('foodType', this.announcementForm.get('foodType')?.value);
    formData.append('expiryDate', this.announcementForm.get('expiryDate')?.value);
    formData.append('pickupTime', this.announcementForm.get('pickupTime')?.value);
    formData.append('address', this.announcementForm.get('address')?.value);
    
    // N'ajoute l'image que si elle a été changée ou est nouvelle
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    }

    // Détermine s'il faut créer ou mettre à jour
    const saveObservable = this.editId 
      ? this.announcementService.updateAnnouncement(this.editId, formData) // RDT-6
      : this.announcementService.createAnnouncement(formData); // RDT-5

    saveObservable.subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log(response); // "Annonce créée/mise à jour"
        this.router.navigate(['/merchant/my-announcements']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Une erreur est survenue.";
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/merchant/my-announcements']);
  }
}