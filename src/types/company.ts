/**
 * Interface représentant une entreprise
 * 
 * Définit les informations de base d'une entreprise
 * et ses relations avec les utilisateurs.
 * 
 * @param {number} id - ID de l'entreprise
 * @param {string} name - Nom de l'entreprise
 * @param {string} siretNumber - Numéro de SIRET de l'entreprise
 * @param {number} planId - ID du plan associé à l'entreprise
 * @param {Plan} plan - Plan associé à l'entreprise (optionnel, selon les endpoints)
 * @param {string} createdAt - Date de création de l'entreprise
 * @param {string} updatedAt - Date de mise à jour de l'entreprise
 * @param {string} deletedAt - Date de suppression de l'entreprise
 */
export interface Company {
  id: number;
  name: string;
  siretNumber: string;
  planId: number;
  plan?: Plan | null; // Optionnel car certains endpoints ne le retournent pas
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Interface pour la mise à jour d'une entreprise
 * 
 * Contient les informations nécessaires pour mettre à jour une entreprise.
 * 
 * Tous les champs sont optionnels.
 * 
 * @param {string} [name] - Nom de l'entreprise
 * @param {string} [siretNumber] - Numéro de SIRET de l'entreprise
 * @param {number} [planId] - ID du plan associé à l'entreprise
 */
export interface CompanyUpdateDto {
  name?: string;
  siretNumber?: string;
  planId?: number;
}

/**
 * Interface pour la création d'une entreprise
 * 
 * Contient les informations nécessaires pour créer une entreprise.
 * 
 * Tous les champs sont obligatoires.
 * 
 * @param {string} name - Nom de l'entreprise
 * @param {string} siretNumber - Numéro de SIRET de l'entreprise
 * @param {number} planId - ID du plan associé à l'entreprise
 */
export interface CompanyCreateDto {
  name: string;
  siretNumber: string;
  planId: number;
}

/**
 * Interface représentant un plan
 * 
 * Définit les informations de base d'un plan
 * et ses relations avec les entreprises.
 * 
 * @param {number} id - ID du plan
 * @param {string} comment - Commentaire associé au plan
 * @param {PlanType} type - Type de plan
 * @param {string} createdAt - Date de création du plan
 * @param {string} updatedAt - Date de mise à jour du plan
 * @param {string} deletedAt - Date de suppression du plan
 * @param {string} expiredAt - Date d'expiration du plan
 */
export interface Plan {
  id: number;
  comment: string;
  type: PlanType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  expiredAt: string;
}

/**
 * Énumération des types de plans
 * 
 * Définit les types de plans disponibles.
 */
export enum PlanType {
  SELF_MANAGE = "SELF_MANAGE",
  ADMIN_MANAGE = "ADMIN_MANAGE"
}