import "react-native-gesture-handler/jestSetup";

// Mock setImmediate
global.setImmediate = jest.fn((cb) => cb());

// Mock react-native-screens
jest.mock("react-native-screens", () => ({
  ...jest.requireActual("react-native-screens"),
  enableScreens: jest.fn(),
  useScreens: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

global.mockNavigate = mockNavigate;

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

jest.mock("firebase/app", () => ({
  getApp: jest.fn(),
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock("react-native-modal", () => {
  const Modal = ({ children, isVisible, onClose }) => {
    if (!isVisible) return null;
    return children;
  };
  return Modal;
});

jest.mock("@/store/question", () => ({
  useQuestionStore: () => ({
    questions: [
      {
        question: "Pergunta 1",
        options: ["Resposta 1", "Resposta 2", "Resposta 3"],
      },
      {
        question: "Pergunta 2",
        options: ["Resposta 1", "Resposta 2", "Resposta 3"],
      },
    ],
    setSelectedAnswers: jest.fn(),
  }),
}));
