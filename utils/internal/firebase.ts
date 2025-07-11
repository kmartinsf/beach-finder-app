import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QuerySnapshot,
  where,
  writeBatch,
} from "firebase/firestore";
import { useQuestionStore } from "../../store/question";
import { Beach } from "../../types/beaches";
import { Question } from "../../types/questions";

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID =
  process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const mapDocToBeach = (doc: DocumentData): Beach => {
  const data = doc.data();
  if (!data) {
    return {} as Beach;
  }
  return {
    id: doc.id,
    name: data.name ?? "Sem nome",
    region: data.region ?? "Desconhecida",
    description: data.description ?? "Sem descrição",
    waves: data.waves ?? false,
    waterTemp: data.waterTemp ?? "Desconhecida",
    favourite: false,
    trail: data.trail ?? false,
  };
};

const tempMap: Record<string, string> = {
  Gelada: "cold",
  Quente: "warm",
  Indiferente: "indiferente",
};

const wavesMap: Record<string, boolean> = {
  Calmo: false,
  "Moderado/Agitado": true,
};

const mapDocToQuestion = (doc: DocumentData): Question => {
  const data = doc.data();
  return {
    id: doc.id,
    question: data?.question || "Pergunta não especificada",
    options: Array.isArray(data?.options) ? data.options : [],
  };
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export const beachesCollection = collection(db, "beaches");
export const questionsCollection = collection(db, "questions");

export const seedBeaches = async () => {
  const beaches = [
    {
      name: "Praia da Solidão",
      region: "south",
      description:
        "A Praia da Solidão, no sul de Florianópolis, é um refúgio tranquilo cercado por Mata Atlântica e mar cristalino. Pouco movimentada, tem uma pequena cachoeira de água doce que deságua na areia. Ideal para quem busca sossego e contato com a natureza.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia do Pântano do Sul",
      region: "south",
      description:
        "Com cerca de 2,5 km de extensão, a Praia do Pântano do Sul reúne trechos de mar calmo e outros mais agitados, agradando a diferentes perfis de banhistas. A faixa de areia é ampla e clara, e o cenário, cercado por morros e barcos coloridos, transmite simplicidade e beleza natural. Um lugar sossegado para quem busca o lado mais autêntico da ilha.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia do Matadeiro",
      region: "south",
      description:
        "O nome curioso vem da antiga prática de abate de baleias, comum na região no século XVIII, quando a praia era conhecida como “Saco do Matadouro”. Hoje, o Matadeiro encanta por sua beleza bruta e ambiente sossegado. Suas águas agitadas atraem surfistas, enquanto a natureza ao redor convida ao descanso e à contemplação.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia da Armação",
      region: "south",
      description:
        "Com clima de vila e cenário simples, a Armação une mar, barcos e vida tranquila. Boa para caminhar, nadar ou curtir frutos do mar à beira da praia. Ideal para quem busca sossego sem abrir mão da cultura local.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia dos Açores",
      region: "south",
      description:
        "A Praia dos Açores, no sul de Florianópolis, é conhecida pelo mar agitado, areia clara e paisagem cercada por morros cobertos de Mata Atlântica. É um bom destino para quem busca sossego, natureza preservada e momentos de contemplação à beira-mar.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia da Galheta",
      region: "south",
      description:
        "A Praia da Galheta é uma das mais preservadas de Florianópolis, acessível por trilha a partir da Praia Mole ou da Barra da Lagoa. Cercada por morros e vegetação nativa, oferece um cenário rústico e tranquilo. O mar tem ondas fortes, atrai surfistas e é liberado para o naturismo. Não há comércio nem estrutura, apenas natureza.",
      waves: true,
      waterTemp: "cold",
      trail: true,
    },

    {
      name: "Praia de Naufragados",
      region: "south",
      description:
        "No canto mais ao sul da ilha, Naufragados é uma praia isolada e cheia de história. Com mar forte, areia clara e natureza preservada, o lugar carrega o nome de um antigo naufrágio e guarda ruínas de outros tempos. Ideal para quem busca sossego, paisagem selvagem e uma conexão com o passado.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia do Morro das Pedras",
      region: "south",
      description:
        "Praia do Morro das Pedras, localizada no sul de Floripa, é marcada por pedras e costões rochosos que criam um visual dramático e preservado. As ondas fortes e constantes atraem surfistas, mas exigem atenção de banhistas devido ao mar agitado. No do morro, o mirante com a Casa de Retiro Vila Fátima oferece uma das vistas mais lindas da ilha.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia do Campeche",
      region: "south",
      description:
        "A Praia do Campeche tem uma longa faixa de areia branca e mar azul vibrante, muito procurada por surfistas e quem curte caminhar à beira-mar. É uma das queridinhas do sul da ilha, com clima jovem, natureza preservada e vista para a Ilha do Campeche. Mesmo com o mar mais agitado, tem trechos tranquilos e boa estrutura para passar o dia.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia do Saquinho",
      region: "south",
      description:
        "A Praia do Saquinho é pequena, isolada e cercada por natureza, ideal para quem busca sossego. Só se chega por trilha, partindo da Praia da Solidão, em cerca de 30 minutos. Sem estrutura turística, tem mar claro e costões rochosos que encantam pela simplicidade.",
      waves: true,
      waterTemp: "cold",
      trail: true,
    },
    {
      name: "Praia da Joaquina",
      region: "east",
      description:
        "A Praia da Joaquina é famosa por sediar campeonatos de surf e atrair atletas do mundo todo. Suas dunas enormes também são destaque, perfeitas para quem curte sandboard e aventura. É uma das praias mais emblemáticas de Floripa, unindo esporte e paisagem única.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Lagoa da Conceição",
      region: "east",
      description:
        "A Lagoa da Conceição é perfeita para quem busca águas calmas, quentes e rasas, ideais para banho em família ou esportes como stand-up paddle. O visual combina dunas, vegetação nativa e um pôr do sol deslumbrante que transforma a paisagem no fim do dia.",
      waves: false,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia Mole",
      region: "east",
      description:
        "A Praia Mole é uma das mais famosas de Florianópolis, conhecida pelas ondas fortes que atraem surfistas do Brasil e do mundo. Seu nome vem da areia fofa e macia, que afunda sob os pés e dá a sensação de “mole”.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia do Gravatá",
      region: "east",
      description:
        "A Praia do Gravatá é pequena, isolada e cercada por natureza, acessível por trilha a partir da Praia Mole. Seu nome vem dos gravatás, bromélias típicas da região. Próximo dali, o Centro de Arqueoastronomia abriga vestígios arqueológicos e marcações solares feitas por povos antigos.",
      waves: true,
      waterTemp: "cold",
      trail: true,
    },
    {
      name: "Praia da Lagoinha do Leste",
      region: "east",
      description:
        "A Lagoinha do Leste é uma das praias mais preservadas de Florianópolis, acessível apenas por trilhas ou barco. Rodeada por morros e vegetação nativa, combina mar agitado, areia clara e uma lagoa de água doce ao fundo. ",
      waves: true,
      waterTemp: "cold",
      trail: true,
    },
    {
      name: "Praia da Barra da Lagoa",
      region: "east",
      description:
        "A Praia da Barra da Lagoa é uma das preferidas para quem quer aprender a surfar, com mar propício e várias escolas na orla. O canal que liga a Lagoa da Conceição ao mar atravessa o bairro e dá charme ao local. Ali também fica o Projeto Tamar, com tanques de tartarugas e atividades educativas sobre preservação marinha.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia do Moçambique",
      region: "east",
      description:
        "A Praia do Moçambique é a maior de Florianópolis, com 13km de areia clara e fina e mar forte, atraindo surfistas em busca de ondas abertas. Faz parte do Parque Estadual do Rio Vermelho, área de preservação com trilhas, camping e vegetação nativa. Sem construções ou comércio, a praia tem clima selvagem e é ideal para quem busca tranquilidade e natureza bruta.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia do Santinho",
      region: "north",
      description:
        "Seu nome vem de uma inscrição rupestre que moradores antigos acreditavam representar um santo, passando a chamar a figura de “santinho”. Hoje, trilhas e mirantes revelam outras gravuras milenares, unindo história, misticismo e paisagens de tirar o fôlego.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia dos Ingleses",
      region: "north",
      description:
        "A Praia dos Ingleses é uma das mais movimentadas da cidade, com ótima estrutura, comércio agitado e clima familiar. O mar varia entre trechos calmos e outros com boas ondas, atraindo banhistas e surfistas iniciantes. Dunas, trilhas e a forte presença de turistas completam o cenário vibrante e animado da região.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia Brava",
      region: "north",
      description:
        "A Praia Brava é um dos principais destinos para o surf em Florianópolis, com mar agitado e visual impressionante. Rodeada por morros e costões, mantém um clima de natureza preservada mesmo com boa estrutura.",
      waves: true,
      waterTemp: "cold",
      trail: false,
    },
    {
      name: "Praia da Lagoinha",
      region: "north",
      description:
        "Conhecida como Lagoinha do Norte, a praia tem mar calmo, areia clara e clima familiar, ideal para relaxar. Cercada por costões e natureza, preserva o charme de vila de pescadores e uma atmosfera tranquila. É uma das opções mais sossegadas do norte da ilha, perto de bairros com boa estrutura.",
      waves: false,
      waterTemp: "warm",
      trail: false,
    },
    {
      name: "Praia da Ponta das Canas",
      region: "north",
      description:
        "Praia tranquila no norte da ilha, com mar calmo, areia clara e clima familiar. Barcos de pesca e uma pequena lagoa compõem o cenário, que mistura natureza e vida local. Tem boa estrutura, mas mantém o charme de vila praiana.",
      waves: false,
      waterTemp: "warm",
      trail: false,
    },
    {
      name: "Praia da Cachoeira do Bom Jesus",
      region: "north",
      description:
        "Cachoeira do Bom Jesus é uma praia tranquila e familiar no norte de Florianópolis, com mar calmo, morno e águas transparentes — ideal para banho e crianças. Tem boa infraestrutura, areia clara e fina, e é cercada por natureza e bairros residenciais.",
      waves: false,
      waterTemp: "warm",
      trail: false,
    },
    {
      name: "Praia de Canasvieiras",
      region: "north",
      description:
        "Canasvieiras é uma das praias mais movimentadas do norte de Florianópolis, com mar calmo, águas mornas e excelente infraestrutura. É bastante procurada por turistas estrangeiros. Oferece comércio ativo, vida noturna e passeios de barco. Ideal para quem busca praticidade sem abrir mão do banho de mar.",
      waves: false,
      waterTemp: "warm",
      trail: false,
    },
    {
      name: "Praia de Jurerê",
      region: "north",
      description:
        "Jurerê é uma praia charmosa no norte de Florianópolis, com mar calmo, águas claras e areia branca. Divide-se entre o lado Tradicional, mais tranquilo e familiar, e Jurerê Internacional, conhecido pelos beach clubs sofisticados e clima luxuoso. É ideal tanto para relaxar quanto para aproveitar o agito do verão.",
      waves: false,
      waterTemp: "warm",
      trail: false,
    },
    {
      name: "Praia do Forte",
      region: "north",
      description:
        "A Praia do Forte é uma das mais tranquilas do norte de Florianópolis, com mar calmo, areia clara e clima familiar. No canto da praia fica a Fortaleza de São José da Ponta Grossa, construção histórica do século XVIII. É um lugar sossegado, com acesso fácil e alguns restaurantes simples à beira-mar.",
      waves: false,
      waterTemp: "warm",
      trail: false,
    },
    {
      name: "Praia da Daniela",
      region: "north",
      description:
        "A Praia da Daniela tem mar calmo, areia clara e clima pacato, perfeita para famílias e banhos tranquilos. Um manguezal preservado contorna a região e abriga diversas espécies, entre elas, jacarés que às vezes aparecem pela praia.",
      waves: false,
      waterTemp: "warm",
      trail: false,
    },
  ];

  const batch = writeBatch(db);

  const snapshot: QuerySnapshot = await getDocs(beachesCollection);
  if (snapshot.empty) {
    beaches.forEach((beach) => {
      const docRef = doc(beachesCollection);
      batch.set(docRef, beach);
    });
    await batch.commit();
  } else {
    throw new Error("Beaches collection already populated");
  }
};

export const seedQuestions = async () => {
  const questions = [
    {
      order: 1,
      question: "A água deve ser?",
      options: ["Gelada", "Quente", "Indiferente"],
    },
    { order: 2, question: "Mar?", options: ["Calmo", "Moderado/Agitado"] },

    { order: 3, question: "Deseja fazer trilha?", options: ["Sim", "Não"] },
  ];

  const batch = writeBatch(db);

  const snapshot: QuerySnapshot = await getDocs(questionsCollection);
  if (snapshot.empty) {
    questions.forEach((question) => {
      const docRef = doc(questionsCollection);
      batch.set(docRef, question);
    });
    await batch.commit();
  } else {
    throw new Error("Questions collection already populated");
  }
};

export const findBeaches = async (answers: string[]): Promise<Beach[]> => {
  try {
    const normalise = (value: string) =>
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    const [tempRaw, waveRaw, trailRaw] = answers;

    const temp = normalise(tempRaw);
    const wave = normalise(waveRaw);
    const trail = normalise(trailRaw);

    const tempAnswer = tempMap[temp];
    const waveAnswer = wavesMap[wave];
    const wantsTrail = trail === "Sim";
    const noTrail = trail === "Não";

    let q = beachesCollection;

    const filters = [];

    if (tempAnswer && tempAnswer !== "indiferente") {
      filters.push(where("waterTemp", "==", tempAnswer));
    }

    if (waveAnswer !== undefined) {
      filters.push(where("waves", "==", waveAnswer));
    }

    if (wantsTrail) {
      filters.push(where("trail", "==", true));
    } else if (noTrail) {
      filters.push(where("trail", "==", false));
    }

    const finalQuery = query(q, ...filters);
    const snapshot = await getDocs(finalQuery);

    const beaches = snapshot.docs.map(mapDocToBeach) as Beach[];

    return beaches;
  } catch (error) {
    console.error("Erro ao buscar praias:", error);
    return [];
  }
};

export const seedDatabase = async () => {
  try {
    const beachesSnapshot: QuerySnapshot = await getDocs(beachesCollection);
    const questionsSnapshot: QuerySnapshot = await getDocs(questionsCollection);

    if (!beachesSnapshot.empty && !questionsSnapshot.empty) {
      return;
    }

    await seedBeaches();
    await seedQuestions();
  } catch (error) {
    throw error;
  }
};

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const questionsRef = collection(db, "questions");
    const orderedQuery = query(questionsRef, orderBy("order", "asc"));
    const snapshot = await getDocs(orderedQuery);
    const questions = snapshot.docs.map(mapDocToQuestion);

    useQuestionStore.getState().setQuestions(questions);
    return questions;
  } catch (error) {
    return [];
  }
};

export const clearCollections = async () => {
  try {
    const beachesSnapshot = await getDocs(beachesCollection);
    await Promise.all(
      beachesSnapshot.docs.map((beachDoc) =>
        deleteDoc(doc(beachesCollection, beachDoc.id))
      )
    );

    const questionsSnapshot = await getDocs(questionsCollection);
    await Promise.all(
      questionsSnapshot.docs.map((questionDoc) =>
        deleteDoc(doc(questionsCollection, questionDoc.id))
      )
    );
  } catch (error) {
    throw error;
  }
};

export const repopulateDatabase = async () => {
  try {
    await clearCollections();
    await seedDatabase();
  } catch (error) {
    throw error;
  }
};
