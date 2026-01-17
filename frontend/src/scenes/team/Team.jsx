import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import CreateIcon from "@mui/icons-material/Create";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import ArchiveIcon from "@mui/icons-material/Archive";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ImageIcon from "@mui/icons-material/Image";
import Header from "../../components/Header";
import ChatBox from "../../components/chats/ChatBox";
import AICard from "../../components/chats/AICard";
import ChatHandler from "../../handlers/ChatHandler";

const Team = () => {
  const ais = [
    {
      id: "assistant_dean",
      name: "Assistant Dean",
      color: "#1976d2",
      icon: <AdminPanelSettingsOutlinedIcon />,
      description: "Strategic partner & Chief of Staff",
    },
    {
      id: "auditor",
      name: "The Auditor",
      color: "#d32f2f",
      icon: <GavelIcon />,
      description: "NTSB Investigator - Just Culture enforcer",
    },
    {
      id: "creative_writing_fellow",
      name: "Creative Writing Fellow",
      color: "#9c27b0",
      icon: <CreateIcon />,
      description: "Financial thriller writer",
    },
    {
      id: "research_librarian",
      name: "Research Librarian",
      color: "#2e7d32",
      icon: <LocalLibraryIcon />,
      description: "Forensic fact sheet provider",
    },
    {
      id: "the_archivist",
      name: "The Archivist",
      color: "#ed6c02",
      icon: <ArchiveIcon />,
      description: "Visual technician - Shot lists",
    },
    {
      id: "the_social_media_intern",
      name: "Social Media Intern",
      color: "#7b1fa2",
      icon: <InstagramIcon />,
      description: "60-second flight log creator",
    },
    {
      id: "the_music_supervisor",
      name: "Music Supervisor",
      color: "#0288d1",
      icon: <MusicNoteIcon />,
      description: "Sonic identity curator",
    },
    {
      id: "the_title_thumbnail_specialist",
      name: "Title/Thumbnail Specialist",
      color: "#c62828",
      icon: <ImageIcon />,
      description: "Trojan Horse architect",
    },
  ];

  const [focusedAI, setFocusedAI] = useState("assistant_dean");
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState({});
  const [tokenCount, setTokenCount] = useState(0);
  const [chatHandler] = useState(() => new ChatHandler());
  const [isFirstMessage, setIsFirstMessage] = useState({});

  const makeMessageId = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  };

  const focused = ais.find((ai) => ai.id === focusedAI);
  const unfocused = ais.filter((ai) => ai.id !== focusedAI);
  const currentMessages = messages[focusedAI] || [];

  const fetchTokenCount = async (aiId) => {
    const count = await chatHandler.getTokenCount(aiId);
    if (aiId === focusedAI) setTokenCount(count);
  };

  useEffect(() => {
    const initFirstMessageFlags = async () => {
      const flags = {};
      for (const ai of ais) {
        const count = await chatHandler.getTokenCount(ai.id);
        flags[ai.id] = count === 0;
      }
      setIsFirstMessage(flags);
    };

    initFirstMessageFlags();
    fetchTokenCount(focusedAI);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appendAssistantResult = (aiId, result) => {
    const gotArrayModules = Array.isArray(result.response);
    const messageType = gotArrayModules ? "modular" : (result.messageType || "normal");

    setMessages((prev) => {
      const next = [
        ...(prev[aiId] || []),
        {
          id: makeMessageId(),
          role: "assistant",
          content: result.response,
          messageType,
          timestamp: new Date().toISOString(),
        },
      ];

      if (messageType === "modular" && typeof result.nonSyllabusText === "string" && result.nonSyllabusText.trim()) {
        next.push({
          id: makeMessageId(),
          role: "assistant",
          content: result.nonSyllabusText,
          messageType: "normal",
          timestamp: new Date().toISOString(),
        });
      }

      if (aiId === "assistant_dean" && Array.isArray(result.assignments) && result.assignments.length > 0) {
        next.push({
          id: makeMessageId(),
          role: "assistant",
          content: result.assignments,
          messageType: "assignments",
          timestamp: new Date().toISOString(),
        });
      }

      if (messageType === "modular" && typeof result.mosPlan === "string" && result.mosPlan.trim()) {
        next.push({
          id: makeMessageId(),
          role: "assistant",
          content: `### MOS Execution Plan:\n\n${result.mosPlan}`,
          messageType: "normal",
          timestamp: new Date().toISOString(),
        });
      }

      return { ...prev, [aiId]: next };
    });
  };

  const handleSwitch = (newFocusAI) => {
    setFocusedAI(newFocusAI);
    fetchTokenCount(newFocusAI);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading[focusedAI]) return;

    const text = inputText;
    setInputText("");

    const userMessage = {
      id: makeMessageId(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [focusedAI]: [...(prev[focusedAI] || []), userMessage],
    }));

    setIsLoading((prev) => ({ ...prev, [focusedAI]: true }));

    const result = await chatHandler.sendMessage(focusedAI, text);
    setIsLoading((prev) => ({ ...prev, [focusedAI]: false }));

    if (result.success) {
      appendAssistantResult(focusedAI, result);

      if (isFirstMessage[focusedAI]) {
        setIsFirstMessage((prev) => ({ ...prev, [focusedAI]: false }));
      }

      fetchTokenCount(focusedAI);
    } else {
      setMessages((prev) => ({
        ...prev,
        [focusedAI]: [
          ...(prev[focusedAI] || []),
          {
            id: makeMessageId(),
            role: "assistant",
            content: result.errorDetails || `❌ Error: ${result.error}`,
            timestamp: new Date().toISOString(),
            isError: true,
          },
        ],
      }));
    }
  };

  const handleForwardAssignment = async (assignment) => {
    const targetAiId = assignment?.target_ai_id;
    if (!targetAiId) return;

    const forwardedText = `From Assistant Dean -> To ${assignment.target_label}:\n\n${assignment.content}`;

    const userForwarded = {
      id: makeMessageId(),
      role: "user",
      content: forwardedText,
      timestamp: new Date().toISOString(),
      isForwarded: true,
      forwardedFrom: "Assistant Dean",
      forwardedColor: focused?.color,
    };

    setMessages((prev) => ({
      ...prev,
      [targetAiId]: [...(prev[targetAiId] || []), userForwarded],
    }));

    setIsLoading((prev) => ({ ...prev, [targetAiId]: true }));
    const result = await chatHandler.sendMessage(targetAiId, forwardedText);
    setIsLoading((prev) => ({ ...prev, [targetAiId]: false }));

    if (result.success) {
      appendAssistantResult(targetAiId, result);
    } else {
      setMessages((prev) => ({
        ...prev,
        [targetAiId]: [
          ...(prev[targetAiId] || []),
          {
            id: makeMessageId(),
            role: "assistant",
            content: result.errorDetails || `❌ Error: ${result.error}`,
            timestamp: new Date().toISOString(),
            isError: true,
          },
        ],
      }));
    }
  };

  const handleForwardMessage = async (e, content, fromAiId) => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();

    const fromAi = ais.find((a) => a.id === fromAiId);
    const fromName = fromAi?.name || fromAiId;
    const fromColor = fromAi?.color;

    const deanId = "assistant_dean";
    const forwardedText = `From ${fromName} -> To Assistant Dean:\n\n${content}`;

    const deanUserMsg = {
      id: makeMessageId(),
      role: "user",
      content: forwardedText,
      timestamp: new Date().toISOString(),
      isForwarded: true,
      forwardedFrom: fromName,
      forwardedColor: fromColor,
    };

    setMessages((prev) => ({
      ...prev,
      [deanId]: [...(prev[deanId] || []), deanUserMsg],
    }));

    setIsLoading((prev) => ({ ...prev, [deanId]: true }));
    const result = await chatHandler.sendMessage(deanId, forwardedText);
    setIsLoading((prev) => ({ ...prev, [deanId]: false }));

    if (result.success) {
      appendAssistantResult(deanId, result);
      fetchTokenCount(deanId);
    } else {
      setMessages((prev) => ({
        ...prev,
        [deanId]: [
          ...(prev[deanId] || []),
          {
            id: makeMessageId(),
            role: "assistant",
            content: result.errorDetails || `❌ Error: ${result.error}`,
            timestamp: new Date().toISOString(),
            isError: true,
          },
        ],
      }));
    }
  };

  const handleResetChat = async () => {
    const ok = await chatHandler.resetChat(focusedAI);
    if (!ok) return;

    setMessages((prev) => ({ ...prev, [focusedAI]: [] }));
    setIsLoading((prev) => ({ ...prev, [focusedAI]: false }));
    setTokenCount(0);
    setIsFirstMessage((prev) => ({ ...prev, [focusedAI]: true }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box>
      <Header title="HARDWOOD ACADEMY" subtitle="Front Office Enterprises - AI Team Interface" />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
        <Box sx={{ height: "60vh", width: "100%" }}>
          <ChatBox
            ai={focused}
            messages={currentMessages}
            inputText={inputText}
            onInputChange={(e) => setInputText(e.target.value)}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onResetChat={handleResetChat}
            onForwardAssignment={handleForwardAssignment}
            onForwardMessage={focusedAI === "assistant_dean" ? undefined : handleForwardMessage}
            isLoading={isLoading[focusedAI]}
            tokenCount={tokenCount}
            isFocused={true}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {unfocused.map((ai, idx) => (
            <AICard key={ai.id} ai={ai} index={idx} onClick={() => handleSwitch(ai.id)} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Team;
