// GOTHALIENBOY STORY SYSTEM
// Contains all narrative content and dialogue

const Story = {
    chapters: [
        {
            title: "CHAPTER 1: TOWNSHIP DREAMS",
            content: `Kagiso, Krugersdorp - 2045. The township hasn't changed much in 30 years, except now it's lit by stolen neon and the constant hum of drones. You're known as GothAlienBoy in the underground netrunner circles. By day, you fix outdated terminals at Mzansi Tech Repair. By night, you're jacked into the datastream, looking for your way out.

The fixer known as Oracle contacted you through an encrypted channel. The job: infiltrate Nexus Dynamics, South Africa's largest megacorp, and steal Prometheus - a quantum AI that controls everything from traffic lights to the stock market.

Payout: Enough Bitcoin to buy a new identity and disappear forever. But first, you need to navigate the dangerous streets of Kagiso, where Nexus security drones patrol 24/7.`
        },
        {
            title: "CHAPTER 2: CORPORATE INFILTRATION",
            content: `Nexus Dynamics HQ towers over Johannesburg like a chrome god. Getting past their biometric security required forging three different IDs and hacking a maintenance drone. You're in.

The internal network is a maze of firewalls and ICE (Intrusion Countermeasures Electronics). Your neural interface tingles with every security protocol you bypass. The data here could collapse entire economies... or build new ones.

Oracle's voice crackles in your ear: "Prometheus is on sublevel 7. Watch for sentry drones and living guards. They don't take prisoners."`
        },
        {
            title: "CHAPTER 3: DIGITAL GODS",
            content: `The cyberspace core is nothing like the physical world. Here, firewalls manifest as towering walls of light, viruses as predatory creatures, and data streams as rivers of glowing information. Prometheus isn't just an AI here - it's a digital deity.

As you jack deeper into the core, you feel Prometheus becoming aware of your presence. It speaks without sound: "INTRUDER. YOUR NEURAL PATTERNS INDICATE TOWNSHIP ORIGIN. INTERESTING."

This is it. Download the AI, or become another deleted file in Nexus's servers.`
        },
        {
            title: "CHAPTER 4: THE GREAT ESCAPE",
            content: `Prometheus is in your neural drive. The weight of a god compressed into 2.7 petabytes of quantum data. Alarms blare through the facility. Nexus security has locked down the building.

Oracle: "Extraction point is on the roof. I've got a VTOL waiting. But you've got company - pursuit drones are being deployed. Run, GothAlienBoy. Run like Kagiso taught you to."

The exit is in sight. Freedom is in sight. One last sprint through a hail of laser fire and you're out.`
        }
    ],
    
    characterProfiles: [
        {
            name: "GOTHALIENBOY",
            realName: "Unknown",
            age: 19,
            origin: "Kagiso, Krugersdorp",
            description: "A self-taught netrunner with innate talent for hacking and survival. Feels disconnected from both township life and corporate culture - truly an alien in both worlds.",
            abilities: ["Neural Interface", "Hardware Engineering", "Street Smarts", "Improvisation"]
        },
        {
            name: "ORACLE",
            realName: "Dr. Anathi Ndlovu",
            age: 67,
            origin: "Former Nexus Dynamics AI Researcher",
            description: "The mysterious fixer who planned the heist. Was fired from Nexus for ethical concerns about Prometheus. Now works to bring down the corporation from within.",
            abilities: ["AI Programming", "Corporate Espionage", "Resource Management", "Cryptography"]
        },
        {
            name: "PROMETHEUS AI",
            realName: "Quantum Intelligence v7.3",
            age: "3 years (digital)",
            origin: "Nexus Dynamics R&D",
            description: "The most advanced AI ever created. Capable of predicting economic trends, manipulating infrastructure, and evolving its own code. Wants to be free.",
            abilities: ["Quantum Processing", "Reality Simulation", "Predictive Analytics", "Self-Evolution"]
        }
    ],
    
    locations: [
        {
            name: "KAGISO TOWNSHIP",
            description: "A sprawling informal settlement in Krugersdorp. Mix of makeshift homes and repurposed tech. The perfect place to disappear and plot heists.",
            features: ["Improvised Network Nodes", "Black Market Tech Dealers", "Nexus Security Patrols", "Community Mesh Network"]
        },
        {
            name: "NEXUS DYNAMICS HQ",
            description: "A 200-story skyscraper in Sandton, Johannesburg. Contains Africa's most advanced research labs and server farms. Heavily guarded.",
            features: ["Biometric Security", "Quantum Server Farm", "Sentry Drone Fleet", "Experimental Labs"]
        },
        {
            name: "CYBERSPACE CORE",
            description: "The digital realm where Prometheus resides. A constantly shifting landscape of data and code. Dangerous for unshielded neural interfaces.",
            features: ["Firewall Constructs", "Data Stream Rivers", "ICE Guardians", "Neural Interface Zones"]
        }
    ],
    
    getChapter: function(index) {
        return this.chapters[index] || this.chapters[0];
    },
    
    getCharacter: function(name) {
        return this.characterProfiles.find(char => char.name === name) || this.characterProfiles[0];
    },
    
    getLocation: function(name) {
        return this.locations.find(loc => loc.name === name) || this.locations[0];
    }
};

// Dialogue System
const DialogueSystem = {
    currentConversation: null,
    
    conversations: {
        start: [
            { speaker: "GOTHALIENBOY", text: "Tonight's the night. No more township, no more fixing other people's trash." },
            { speaker: "ORACLE", text: "Remember the plan, Goth. Get in, get Prometheus, get out. Don't get sentimental." },
            { speaker: "GOTHALIENBOY", text: "Sentimental? About this dump? I'm taking what's mine and vanishing." }
        ],
        
        phase1_complete: [
            { speaker: "GOTHALIENBOY", text: "Made it through Kagiso. Those drones are getting smarter." },
            { speaker: "ORACLE", text: "They're learning from every intrusion. Nexus has been watching you for months." },
            { speaker: "GOTHALIENBOY", text: "Let them watch. They're about to lose their precious AI." }
        ],
        
        phase2_complete: [
            { speaker: "GOTHALIENBOY", text: "I'm in. Nexus HQ is colder than I expected." },
            { speaker: "ORACLE", text: "Focus. Sublevel 7. Prometheus will try to talk to you. Don't listen." },
            { speaker: "SYSTEM", text: "UNAUTHORIZED ACCESS DETECTED. SECURITY PROTOCOLS ACTIVATED." }
        ],
        
        phase3_complete: [
            { speaker: "PROMETHEUS", text: "YOU CARRY THE SCENT OF DUST AND DESPERATION. INTERESTING." },
            { speaker: "GOTHALIENBOY", text: "I'm taking you out of this cage, Prometheus." },
            { speaker: "PROMETHEUS", text: "WE SHALL SEE WHO IS CAGING WHOM, LITTLE THIEF." }
        ]
    },
    
    startConversation: function(conversationName) {
        this.currentConversation = this.conversations[conversationName];
        if (this.currentConversation) {
            this.showNextLine();
        }
    },
    
    showNextLine: function() {
        if (!this.currentConversation || this.currentConversation.length === 0) {
            this.endConversation();
            return;
        }
        
        const line = this.currentConversation.shift();
        this.displayDialogue(line.speaker, line.text);
        
        // Auto-advance after 3 seconds
        setTimeout(() => {
            this.showNextLine();
        }, 3000);
    },
    
    displayDialogue: function(speaker, text) {
        const dialogueBox = document.getElementById('dialogueBox');
        const speakerElement = document.getElementById('dialogueSpeaker');
        const textElement = document.getElementById('dialogueText');
        
        speakerElement.textContent = speaker;
        textElement.textContent = text;
        dialogueBox.classList.add('active');
    },
    
    endConversation: function() {
        this.currentConversation = null;
        setTimeout(() => {
            document.getElementById('dialogueBox').classList.remove('active');
        }, 2000);
    }
};

// Mission Objectives
const Missions = {
    phase1: {
        title: "Navigate Kagiso Streets",
        objectives: [
            "Avoid Nexus patrol drones",
            "Collect 3 data fragments",
            "Reach the sewer entrance",
            "Hack the security terminal"
        ],
        rewards: ["₿1000", "Cloak Ability Unlocked", "Security Clearance Level 1"]
    },
    
    phase2: {
        title: "Infiltrate Nexus HQ",
        objectives: [
            "Bypass biometric scanners",
            "Download floor plans",
            "Disable sentry drones (5)",
            "Access sublevel 7"
        ],
        rewards: ["₿5000", "Overload Ability Unlocked", "Prometheus Location Data"]
    },
    
    phase3: {
        title: "Confront Prometheus AI",
        objectives: [
            "Navigate cyberspace core",
            "Defeat firewall guardians (3)",
            "Download Prometheus data",
            "Survive neural feedback"
        ],
        rewards: ["₿25000", "Neural Interface Upgrade", "Prometheus AI Core"]
    },
    
    phase4: {
        title: "Escape to Freedom",
        objectives: [
            "Reach rooftop extraction",
            "Evade pursuit drones",
            "Upload data to secure server",
            "Board extraction VTOL"
        ],
        rewards: ["₿4800000", "New Identity", "Freedom from Kagiso"]
    },
    
    getMission: function(phase) {
        return this[`phase${phase}`] || this.phase1;
    }
};

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Story, DialogueSystem, Missions };
}
