
import { GoogleUser } from "../types";

const BACKUP_FOLDER_NAME = "AR_CONTROL_GANADERO_BACKUP";

export const simulateGoogleLogin = async (): Promise<GoogleUser> => {
  // Simulación de OAuth flow
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "google_12345",
        name: "Admin Ganadero",
        email: "admin@rancho.com",
        picture: "https://lh3.googleusercontent.com/a/ACg8ocL...",
        driveFolderId: "folder_drive_xyz",
        lastBackup: new Date().toISOString()
      });
    }, 1500);
  });
};

export const syncToGoogleDrive = async (data: any): Promise<boolean> => {
  console.log(`Sincronizando datos con carpeta: ${BACKUP_FOLDER_NAME}...`);
  // Simulación de subida de archivo a Google Drive API
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('ar_last_backup', new Date().toISOString());
      resolve(true);
    }, 2500);
  });
};

export const restoreFromGoogleDrive = async (): Promise<any> => {
  console.log("Consultando archivos de respaldo en Drive...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "Datos recuperados exitosamente" });
    }, 2000);
  });
};
