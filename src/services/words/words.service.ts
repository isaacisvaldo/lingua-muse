import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../api-client";

export interface Example {
  id: number;
  sentence: string;
  translation: string | null;
  definitionId: number;
}

export interface Definition {
  id: number;
  meaning: string;
  partOfSpeech: string;
  wordId: number;
  examples: Example[];
}

export interface Synonym {
  id: number;
  term: string;
  wordId: number;
}

export interface Word {
  id: number;
  term: string;
  language: string;
  phonetic: string | null;
  audioUrl: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  definitions: Definition[];
  synonyms: Synonym[];
  antonyms: Synonym[]; 
}

export interface PaginatedWordsResponse {
  results: Word[];
  total: number;
}

// Resposta paginada da busca (conforme o controller: { results, total })
export interface PaginatedWordsResponse {
  results: Word[];
  total: number;
}

interface SearchWordsParams extends FilterParams {
 query?: string;
 
}

// ✅ DTO para criação de palavra
export interface CreateWordDto {
  term: string;
  translation?: string;
  pronunciation?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
}

// ✅ DTO para atualização de palavra
export interface UpdateWordDto {
  term?: string;
  translation?: string;
  pronunciation?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
}

/**
 * Busca paginada de palavras por termo.
 * Corresponde ao endpoint GET /words?query=&limit=&page=
 * @param params Parâmetros de busca e paginação.
 */
export async function searchWords(
  params: SearchWordsParams ={},
): Promise<PaginatedWordsResponse> {

  return fetchDataWithFilter("/words", params);
}

/**
 * Busca uma palavra específica pelo ID.
 * Corresponde ao endpoint GET /words/:id
 * @param id O ID da palavra.
 */
export async function getWordById(id: number): Promise<Word> {
  return fetchData(`/words/${id}`);
}

/**
 * Busca uma palavra pelo termo exato (com fallback externo).
 * Corresponde ao endpoint GET /words/word/:term
 * @param term O termo exato da palavra.
 */
export async function getWordByTerm(term: string): Promise<Word> {
  return fetchData(`/words/word/${encodeURIComponent(term)}`);
}
interface SearchWordSuggestionParams extends FilterParams {
 q?: string;
 
}
export interface SuggestionItem {
  term: string;
  id: number;
}

// Agora retorna SuggestionItem[] mas o componente usa só .term
export async function getWordSuggestions(
  params: SearchWordSuggestionParams = {}
): Promise<SuggestionItem[]> {
  const { q, limit = 10 } = params;
  if (!q || q.trim().length < 2) return [];

  return fetchDataWithFilter(`/util/suggestions`, { q: q.trim(), limit });
}


/**
 * Cria uma nova palavra.
 * Corresponde ao endpoint POST /words
 * @param data O DTO para criação da palavra.
 */
export async function createWord(data: CreateWordDto): Promise<Word> {
  return sendData("/words", "POST", data);
}

/**
 * Atualiza uma palavra existente.
 * Corresponde ao endpoint PUT /words/:id
 * @param id O ID da palavra a ser atualizada.
 * @param data O objeto com os dados a serem atualizados.
 */
export async function updateWord(
  id: number,
  data: UpdateWordDto,
): Promise<Word> {
  return sendData(`/words/${id}`, "PUT", data);
}

/**
 * Remove uma palavra existente.
 * Corresponde ao endpoint DELETE /words/:id
 * @param id O ID da palavra a ser removida.
 */
export async function deleteWord(id: number): Promise<Word> {
  return deleteData(`/words/${id}`);
}