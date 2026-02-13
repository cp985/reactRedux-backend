require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const fantasyItems = [
  {
    nome: "Pozione di Cura Minore",
    descrizione: "Una semplice pozione che ripristina 50 HP. Abilità: +50 HP istantanei, rimuove sanguinamento leggero, può essere usata in combattimento",
    prezzo: 50,
    categoria: "Consumabili",
    immagine: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    stock: 50,
    disponibile: true,
    rating: 4.2,
    numeroRecensioni: 89,
    rarità: "Comune",
    classe: "Tutte"
  },
  {
    nome: "Spada Corta di Ferro",
    descrizione: "Spada basica per avventurieri principianti. Abilità: +15 danni fisici, durabilità media, buona per allenamento",
    prezzo: 120,
    categoria: "Armi",
    immagine: "https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=500",
    stock: 30,
    disponibile: true,
    rating: 3.8,
    numeroRecensioni: 156,
    rarità: "Comune",
    classe: "Guerriero, Paladino"
  },
  {
    nome: "Mantello del Viaggiatore",
    descrizione: "Mantello resistente alle intemperie. Abilità: +10 difesa, resistenza al freddo +25%, +15% velocità di viaggio su strada, tasche nascoste",
    prezzo: 280,
    categoria: "Armature",
    immagine: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500",
    stock: 20,
    disponibile: true,
    rating: 4.4,
    numeroRecensioni: 203,
    rarità: "Non Comune",
    classe: "Tutte"
  },
  {
    nome: "Arco Composito Elfico",
    descrizione: "Arco fatto dai maestri arcieri elfi. Abilità: +35 danni a distanza, +20% precisione, gittata aumentata del 30%, silenzioso",
    prezzo: 650,
    categoria: "Armi",
    immagine: "https://images.unsplash.com/photo-1566204773863-cf63e6d4ab88?w=500",
    stock: 12,
    disponibile: true,
    rating: 4.6,
    numeroRecensioni: 87,
    rarità: "Non Comune",
    classe: "Ranger, Cacciatore"
  },
  {
    nome: "Anello di Protezione Arcana",
    descrizione: "Anello incantato che crea una barriera magica. Abilità: +25 resistenza magica, assorbe 100 danni magici ogni 60 secondi, +10 mana al secondo",
    prezzo: 1200,
    categoria: "Accessori",
    immagine: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
    stock: 8,
    disponibile: true,
    rating: 4.7,
    numeroRecensioni: 124,
    rarità: "Rara",
    classe: "Mago, Stregone, Chierico"
  },
  {
    nome: "Armatura di Piastre Nanica",
    descrizione: "Armatura pesante forgiata dai nani delle montagne. Abilità: +60 difesa, -20% danni da impatto, immune allo stordimento, resistenza al fuoco +30%",
    prezzo: 1800,
    categoria: "Armature",
    immagine: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500",
    stock: 5,
    disponibile: true,
    rating: 4.8,
    numeroRecensioni: 67,
    rarità: "Rara",
    classe: "Guerriero, Paladino"
  },
  {
    nome: "Grimorio delle Tempeste",
    descrizione: "Libro magico contenente incantesimi di fulmine e vento. Abilità: sblocca 5 incantesimi di fulmine, +40 potere magico, cast veloce -25%, evoca tempesta (ultimate)",
    prezzo: 2400,
    categoria: "Armi",
    immagine: "https://images.unsplash.com/photo-1614029951470-ef9eb9952be7?w=500",
    stock: 4,
    disponibile: true,
    rating: 4.9,
    numeroRecensioni: 89,
    rarità: "Epica",
    classe: "Mago, Elementalista"
  },
  {
    nome: "Stivali del Predatore Notturno",
    descrizione: "Stivali incantati per assassini silenziosi. Abilità: passi totalmente silenziosi, +50% velocità di notte, invisibilità per 5 secondi dopo kill, +25 agilità",
    prezzo: 2100,
    categoria: "Armature",
    immagine: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500",
    stock: 6,
    disponibile: true,
    rating: 4.8,
    numeroRecensioni: 112,
    rarità: "Epica",
    classe: "Assassino, Ladro"
  },
  {
    nome: "Lama dell'Alba Eterna",
    descrizione: "Spada sacra benedetta dagli dei della luce. Abilità: +70 danni sacri, danni extra +100% contro non-morti, emette luce che rivela illusioni, cura 10 HP per colpo critico",
    prezzo: 4200,
    categoria: "Armi",
    immagine: "https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=500",
    stock: 2,
    disponibile: true,
    rating: 5.0,
    numeroRecensioni: 43,
    rarità: "Leggendaria",
    classe: "Paladino, Chierico"
  },
  {
    nome: "Corona del Re Lich",
    descrizione: "Artefatto maledetto di un antico re non-morto. Abilità: evoca 3 scheletri guerrieri, +100 potere necrotico, converte 20% danni in HP, immunità alla morte per 10 secondi (1 volta), malus: corruzione crescente",
    prezzo: 6500,
    categoria: "Accessori",
    immagine: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
    stock: 1,
    disponibile: true,
    rating: 4.9,
    numeroRecensioni: 21,
    rarità: "Mitica",
    classe: "Negromante, Warlock"
  }
];

const seedFantasyItems = async () => {
  try {
    // Connetti a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connesso a MongoDB');
    
    // OPZIONE 1: Cancella tutti i prodotti esistenti e inserisci solo questi 10
    // await Product.deleteMany({});
    // console.log('🗑️  Prodotti vecchi eliminati');
    
    // OPZIONE 2: Aggiungi questi 10 ai prodotti esistenti (usa questa se vuoi mantenere la Spada del Drago)
    // Non cancellare nulla, aggiungi solo
    
    // Inserisci i nuovi prodotti
    const insertedProducts = await Product.insertMany(fantasyItems);
    
    console.log('✅ 10 oggetti fantasy inseriti con successo!');
    console.log(`📦 Totale prodotti inseriti: ${insertedProducts.length}`);
    console.log('\n🎮 Oggetti per rarità:');
    console.log('   - Comuni: 2');
    console.log('   - Non Comuni: 2');
    console.log('   - Rari: 2');
    console.log('   - Epici: 2');
    console.log('   - Leggendari: 1');
    console.log('   - Mitici: 1');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante l\'inserimento:', error);
    process.exit(1);
  }
};

// Esegui lo script
seedFantasyItems();