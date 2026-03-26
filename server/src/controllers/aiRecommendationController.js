const mockPlacesData = {
  "Historical Sites": [
    {
      name: "Pyramids of Giza",
      location: "Giza",
      description: "The Great Pyramids and the Sphinx are symbols of ancient Egypt's incredible architectural prowess.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
      rating: 4.9,
      type: "Historical Site"
    },
    {
      name: "Karnak Temple",
      location: "Luxor",
      description: "A vast complex of decayed temples, chapels, and pylons dedicated to the Theban gods.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/Karnak_temple%2C_Great_Hypostyle_Hall.jpg",
      rating: 4.8,
      type: "Historical Site"
    },
    {
      name: "Valley of the Kings",
      location: "Luxor",
      description: "A valley where tombs were rock-cut for the Pharaohs and powerful nobles of the New Kingdom.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Luxor%2C_Valley_of_the_Kings%2C_Egypt%2C_Oct_2004.jpg",
      rating: 4.7,
      type: "Historical Site"
    },
    {
      name: "Abu Simbel Temples",
      location: "Aswan",
      description: "Massive rock temples built by Ramses II, known for their colossal statues.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Abu_Simbel_Temple_of_Ramesses_II.jpg",
      rating: 4.9,
      type: "Historical Site"
    },
    {
      name: "Philae Temple",
      location: "Aswan",
      description: "An island-based temple complex, relocated meticulously to save it from the flooded Nile.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Philae%2C_Temple_of_Isis%2C_Aswan%2C_Egypt%2C_Oct_2004.jpg/1280px-Philae%2C_Temple_of_Isis%2C_Aswan%2C_Egypt%2C_Oct_2004.jpg",
      rating: 4.8,
      type: "Historical Site"
    }
  ],
  "Museums": [
    {
      name: "Egyptian Museum",
      location: "Cairo",
      description: "Home to an extensive collection of ancient Egyptian antiquities, including King Tutankhamun's treasures.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/The_Egyptian_Museum.jpeg",
      rating: 4.7,
      type: "Museum"
    },
    {
      name: "National Museum of Egyptian Civilization",
      location: "Fustat",
      description: "Showcases the rich history and various eras of Egyptian civilization in a modern setting.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/National_Museum_of_Egyptian_Civilization_NMEC.jpg",
      rating: 4.9,
      type: "Museum"
    },
    {
      name: "Luxor Museum",
      location: "Luxor",
      description: "Displays a beautifully curated collection of items found in the Theban temples and necropolis.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/Luxor_Museum_13.JPG",
      rating: 4.6,
      type: "Museum"
    },
    {
      name: "Grand Egyptian Museum",
      location: "Giza",
      description: "A monumental new museum dedicated to preserving and displaying the nation's immense heritage.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Grand_Egyptian_Museum_%285%29_%28cropped%29.jpg",
      rating: 5.0,
      type: "Museum"
    },
    {
      name: "Nubian Museum",
      location: "Aswan",
      description: "Dedicated to the history, art, and culture of the Nubian civilization.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Nubian_Museum%2C_Aswan%2C_Egypt.jpg",
      rating: 4.8,
      type: "Museum"
    }
  ],
  "Religious Sites": [
    {
      name: "Al-Azhar Mosque",
      location: "Cairo",
      description: "One of the oldest mosques in Cairo and home to the world’s oldest operating university.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Al-Azhar_Mosque_-_Courtyard_and_minarets.jpg",
      rating: 4.8,
      type: "Religious Site"
    },
    {
      name: "Saint Catherine’s Monastery",
      location: "Sinai",
      description: "An ancient Christian monastery situated at the foot of Mount Sinai.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/St_Catherine_Monastery_with_Mount_Sinai.jpg",
      rating: 4.7,
      type: "Religious Site"
    },
    {
      name: "Hanging Church",
      location: "Cairo",
      description: "One of the oldest churches in Egypt, famous for its suspended nave above a Roman fortress gate.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Cairo_-_The_hanging_church_exterior.jpg",
      rating: 4.6,
      type: "Religious Site"
    },
    {
      name: "Mosque of Muhammad Ali",
      location: "Cairo",
      description: "A spectacular Ottoman-style mosque located atop the Citadel of Salah El-Din.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Muhammad_Ali_Mosque_-_panoramio.jpg",
      rating: 4.9,
      type: "Religious Site"
    },
    {
      name: "Abu al-Abbas al-Mursi Mosque",
      location: "Alexandria",
      description: "A beautiful mosque dedicated to the 13th-century Murcian Andalusi Sufi saint.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Abu_El_Abbas_El_Mursi_Mosque.jpg",
      rating: 4.7,
      type: "Religious Site"
    }
  ],
  "Beaches": [
    {
      name: "Sharm El Sheikh",
      location: "Sinai",
      description: "Famous for its crystal-clear waters and spectacular coral reefs perfect for scuba diving.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Sharm_el-Sheikh.jpg",
      rating: 4.8,
      type: "Beach"
    },
    {
      name: "Hurghada",
      location: "Red Sea",
      description: "A major coastal town offering vibrant nightlife, water sports, and beach resorts.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Hurghada_-_Grand_Resort_Pool_Area.jpg",
      rating: 4.6,
      type: "Beach"
    },
    {
      name: "Marsa Alam",
      location: "Red Sea",
      description: "Known for pristine beaches and unique marine life including dugongs and sea turtles.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Abu_Dabab%2C_Marsa_Alam%2C_Red_Sea%2C_Egypt_-_panoramio.jpg",
      rating: 4.9,
      type: "Beach"
    },
    {
      name: "Dahab",
      location: "Sinai",
      description: "A relaxed bohemian town famously loved by windsurfers and backpackers.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Dahab-beach.jpg",
      rating: 4.8,
      type: "Beach"
    },
    {
      name: "El Gouna",
      location: "Red Sea",
      description: "A modern resort town known for its network of lagoons, luxury hotels, and golf courses.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/El_Gouna.jpg",
      rating: 4.7,
      type: "Beach"
    }
  ],
  "Desert Adventures": [
    {
      name: "White Desert",
      location: "Farafra",
      description: "Renowned for its surreal, chalk-white rock formations that look like giant mushrooms.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/White_Desert%2C_Egypt.jpg",
      rating: 4.9,
      type: "Desert"
    },
    {
      name: "Siwa Oasis",
      location: "Western Desert",
      description: "An isolated urban oasis famous for natural springs, salt lakes, and ancient ruins.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Siwa_Oasis.jpg",
      rating: 4.8,
      type: "Desert"
    },
    {
      name: "Black Desert",
      location: "Western Desert",
      description: "Characterized by volcano-shaped mountains with a layer of black stones.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Black_Desert%2C_Egypt.jpg",
      rating: 4.7,
      type: "Desert"
    },
    {
      name: "Bahariya Oasis",
      location: "Western Desert",
      description: "A major depression with hot springs and gateways to the surrounding deserts.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Bahariya_Oasis-01.jpg",
      rating: 4.6,
      type: "Desert"
    },
    {
      name: "Sinai Desert",
      location: "Sinai Peninsula",
      description: "Vast expanses of dramatic, colorful canyons and mountainous terrain.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Sinai_Desert.jpg",
      rating: 4.8,
      type: "Desert"
    }
  ],
  "Food & Markets": [
    {
      name: "Khan El Khalili",
      location: "Cairo",
      description: "Cairo's most famous historic bazaar full of crafts, spices, and souvenirs.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Khan_el-Khalili.jpg",
      rating: 4.9,
      type: "Market"
    },
    {
      name: "Souq El Gomaa",
      location: "Cairo",
      description: "A massive, bustling Friday market where you can find absolutely everything from antiques to pets.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Market_in_Cairo.jpg",
      rating: 4.4,
      type: "Market"
    },
    {
      name: "Alexandria Fish Market",
      location: "Alexandria",
      description: "A lively coastal market where fishermen sell their morning catch to locals.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/Alexandria_Port.jpg",
      rating: 4.6,
      type: "Market"
    },
    {
      name: "Aswan Spice Market",
      location: "Aswan",
      description: "An aromatic marketplace offering vibrant African spices, incense, and Nubian crafts.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Aswan_souq.jpg",
      rating: 4.8,
      type: "Market"
    },
    {
      name: "Felfela (Restaurant)",
      location: "Cairo",
      description: "An iconic restaurant serving authentic and traditional Egyptian cuisine in downtown Cairo.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Felfela.jpg",
      rating: 4.5,
      type: "Food"
    }
  ]
};

const getAiRecommendations = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category || category.trim() === '') {
      return res.status(400).json({ success: false, message: 'Category is required in query params.' });
    }

    console.log(`[Mock AI Engine] Processing request for category: "${category}"`);
    
    // Simulate AI execution delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Try to find an exact match in our mocked categories
    let recommendations = mockPlacesData[category];

    if (!recommendations) {
      // Fallback matching logic for AI
      const loweredCategory = category.toLowerCase();
      const keys = Object.keys(mockPlacesData);
      
      for (const key of keys) {
        if (loweredCategory.includes(key.toLowerCase()) || key.toLowerCase().includes(loweredCategory)) {
          recommendations = mockPlacesData[key];
          break;
        }
      }
    }

    // Default response if totally unrecognized category
    if (!recommendations) {
      recommendations = mockPlacesData["Historical Sites"].slice(0, 3).map(p => ({
        ...p,
        description: `(AI suggested as best match for ${category}): ${p.description}`
      }));
    }

    return res.status(200).json({
      success: true,
      category_requested: category,
      data: recommendations
    });

  } catch (error) {
    console.error('Error fetching AI recommendations:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate recommendations via AI.', error: error.message });
  }
};

module.exports = {
  getAiRecommendations
};
