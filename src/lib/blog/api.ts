import type { BlogPost } from "./types";

const PROJECT_ID = "nettiss-proyect";
const COLLECTION = "publicaciones";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

type FirestoreValue = {
  stringValue?: string;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  integerValue?: string;
  booleanValue?: boolean;
};

type FirestoreDocument = {
  name: string;
  fields: Record<string, FirestoreValue>;
};

type FirestoreListResponse = {
  documents?: FirestoreDocument[];
};

function parseFirestoreValue(value: FirestoreValue): unknown {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values ?? []).map(parseFirestoreValue);
  }
  return null;
}

function parseDocument(doc: FirestoreDocument): BlogPost {
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(doc.fields ?? {})) {
    fields[key] = parseFirestoreValue(value);
  }

  const id = doc.name.split("/").pop() ?? "";

  return {
    id,
    titulo: String(fields.titulo ?? "Sin título"),
    descripcion: String(fields.descripcion ?? ""),
    contenido: String(fields.contenido ?? ""),
    imagen: String(fields.imagen ?? ""),
    fecha: String(fields.fecha ?? ""),
    createdAt: String(fields.createdAt ?? ""),
    estado: String(fields.estado ?? ""),
    seccion: Array.isArray(fields.seccion) ? (fields.seccion as string[]) : [],
  };
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const res = await fetch(BASE_URL, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener publicaciones (${res.status})`);
  }

  const data: FirestoreListResponse = await res.json();

  return (data.documents ?? [])
    .map(parseDocument)
    .filter((post) => post.estado === "publicado")
    .sort((a, b) => {
      const dateA = new Date(a.fecha || a.createdAt).getTime();
      const dateB = new Date(b.fecha || b.createdAt).getTime();
      return dateB - dateA;
    });
}

export function extractSections(posts: BlogPost[]): string[] {
  const sections = new Set<string>();
  for (const post of posts) {
    for (const section of post.seccion) {
      if (section.trim()) sections.add(section.trim());
    }
  }
  return Array.from(sections).sort();
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  const decodedId = decodeURIComponent(id);
  
  const res = await fetch(`${BASE_URL}/${decodedId}`, {
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error al obtener publicación (${res.status})`);
  }

  const data = await res.json();
  const post = parseDocument(data);

  if (post.estado !== "publicado") return null;
  return post;
}