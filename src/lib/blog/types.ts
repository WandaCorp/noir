export type BlogPost = {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  imagen: string;
  fecha: string;
  createdAt: string;
  estado: string;
  seccion: string[];
};

export type BlogPostSummary = Omit<BlogPost, "contenido">;