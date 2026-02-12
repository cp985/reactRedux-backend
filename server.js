const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Verifica che la variabile sia caricata
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Caricato' : '❌ NON trovato')
const connectDB = require('./config/db'); // Commenta per ora

dotenv.config();
connectDB(); // Commenta per ora



const app = express();

app.use(cors()); 
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
// Rotta di test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funziona correttamente su Render!' });
});

// Rotta prodotti mock (senza database)
app.get('/api/products', (req, res) => {


const DUMMY_ITEMS = [
  {
    id: "armor_01",
    name: "Corazza del Guardiano Eterno",
    type: "Armatura",
    slot: "Torso",
    rarity: "Epic", // Common, Rare, Epic, Legendary
    levelRequired: 15,
    weight: 18.5,
    value: 1200,
    image: "https://images.unsplash.com/photo-1548345600-f576144df337?auto=format&fit=crop&q=80&w=800",
    description: "Forgiata nel cuore di una stella morente, questa corazza emana un calore costante che protegge chi la indossa dai venti gelidi del Nord.",
    stats: {
      defense: 45,
      strength: 5,
      magicResist: 20,
      durability: 100
    },
    effects: [
      "Immunità al congelamento",
      "Rigenerazione salute +2/sec"
    ]
  },
  {
    id: "helm_02",
    name: "Elmo del Predatore d'Ombra",
    type: "Elmo",
    slot: "Testa",
    rarity: "Rare",
    levelRequired: 10,
    weight: 4.2,
    value: 450,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b46282?auto=format&fit=crop&q=80&w=800",
    description: "Le fessure per gli occhi brillano di una luce violetta quando un nemico è nelle vicinanze. Apparteneva a una gilda di assassini ormai dimenticata.",
    stats: {
      defense: 12,
      criticalChance: 0.05,
      stealth: 15,
      durability: 80
    },
    effects: [
      "Visione notturna migliorata",
      "Danni da colpo critico +10%"
    ]
  },
  {
    id: "shield_03",
    name: "Scudo del Baluardo Solare",
    type: "Scudo",
    slot: "Mano Secondaria",
    rarity: "Legendary",
    levelRequired: 25,
    weight: 25.0,
    value: 3500,
    image: "https://images.unsplash.com/photo-1615110300647-814041761668?auto=format&fit=crop&q=80&w=800",
    description: "Si dice che questo scudo rifletta non solo la luce, ma anche le intenzioni malvagie dei nemici. È la prova del valore dei paladini del Sole.",
    stats: {
      defense: 80,
      blockChance: 0.25,
      fireResistance: 50,
      durability: 500
    },
    effects: [
      "Riflette il 10% dei danni fisici",
      "Luce sacra: acceca i non-morti al blocco"
    ]
  },
  {
    id: "gauntlets_04",
    name: "Guanti in Pelle di Drago",
    type: "Guanti",
    slot: "Mani",
    rarity: "Common",
    levelRequired: 5,
    weight: 1.5,
    value: 80,
    image: "https://images.unsplash.com/photo-1594061683313-24dca39dc767?auto=format&fit=crop&q=80&w=800",
    description: "Semplici guanti rinforzati con scaglie di drago minore. Offrono un'ottima presa e protezione contro le abrasioni.",
    stats: {
      defense: 8,
      dexterity: 3,
      attackSpeed: 0.05,
      durability: 60
    },
    effects: []
  },
  {
    id: "boots_05",
    name: "Stivali del Viaggiatore Rapido",
    type: "Stivali",
    slot: "Piedi",
    rarity: "Rare",
    levelRequired: 8,
    weight: 2.0,
    value: 320,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    description: "Incantati con piume di grifone, questi stivali rendono il passo leggero come il vento, riducendo la fatica durante le lunghe marce.",
    stats: {
      defense: 10,
      movementSpeed: 1.15,
      stamina: 20,
      durability: 120
    },
    effects: [
      "Riduzione consumo stamina nella corsa del 15%",
      "Caduta rallentata"
    ]
  }
];



  res.json(mockProducts);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));