import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../store/index";
// import { updateStudentStats } from "../store/slices/authSlice"; // Comment out until this export is fixed
import { Achievement, Badge, Student } from "../types/index";
import toast from "react-hot-toast";

// Type guard to check if user is a student
const isStudent = (user: any): user is Student => {
  return user && user.role === 'student' && 'stats' in user;
};

interface GamificationState {
  achievements: Achievement[];
  earnedBadges: Badge[];
  availablePoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  pointsToNextLevel: number;
  recentAchievements: Badge[];
}

interface PointsConfig {
  lessonComplete: number;
  gameComplete: number;
  quizPerfect: number;
  dailyStreak: number;
  weeklyStreak: number;
  firstTime: number;
}

const POINTS_CONFIG: PointsConfig = {
  lessonComplete: 50,
  gameComplete: 30,
  quizPerfect: 100,
  dailyStreak: 10,
  weeklyStreak: 50,
  firstTime: 20,
};

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7250, 9250, 11500, 14000,
  16750, 19750, 23000,
];

export const useGamification = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [gamificationState, setGamificationState] = useState<GamificationState>(
    {
      achievements: [],
      earnedBadges: [],
      availablePoints: 0,
      currentLevel: 1,
      currentStreak: 0,
      longestStreak: 0,
      pointsToNextLevel: 100,
      recentAchievements: [],
    }
  );

  const [isLoading, setIsLoading] = useState(false);

  // Load gamification data on mount
  useEffect(() => {
    if (user && user.role === "student") {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    try {
      setIsLoading(true);

      // Load achievements and badges
      const [achievementsRes, badgesRes] = await Promise.all([
        fetch("/api/gamification/achievements", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/students/achievements", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      if (achievementsRes.ok && badgesRes.ok) {
        const achievements = await achievementsRes.json();
        const badges = await badgesRes.json();

        if (!user || !isStudent(user)) {
          console.warn('Gamification is only available for students');
          return;
        }

        const currentLevel = calculateLevel(user.stats.totalPoints);
        const pointsToNext = calculatePointsToNextLevel(user.stats.totalPoints);

        setGamificationState({
          achievements: achievements.data,
          earnedBadges: badges.data,
          availablePoints: user.stats.totalPoints,
          currentLevel,
          currentStreak: user.stats.streak,
          longestStreak: user.stats.longestStreak || user.stats.streak,
          pointsToNextLevel: pointsToNext,
          recentAchievements: badges.data.slice(-3), // Last 3 achievements
        });
      }
    } catch (error) {
      console.error("Failed to load gamification data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevel = (totalPoints: number): number => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalPoints >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  const calculatePointsToNextLevel = (totalPoints: number): number => {
    const currentLevel = calculateLevel(totalPoints);
    const nextLevelThreshold =
      LEVEL_THRESHOLDS[currentLevel] ||
      LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    return Math.max(0, nextLevelThreshold - totalPoints);
  };

  const awardPoints = useCallback(
    async (
      type: keyof PointsConfig,
      multiplier: number = 1,
      metadata?: any
    ) => {
      if (!user || user.role !== "student") return;

      const basePoints = POINTS_CONFIG[type];
      const pointsAwarded = Math.floor(basePoints * multiplier);

      try {
        // Update local state immediately for better UX
        const newTotalPoints = user.stats.totalPoints + pointsAwarded;
        const newLevel = calculateLevel(newTotalPoints);
        const oldLevel = calculateLevel(user.stats.totalPoints);

        // Check for level up
        if (newLevel > oldLevel) {
          toast.success(t("notifications.levelUp", { level: newLevel }), {
            duration: 5000,
            icon: "🎉",
          });
        }

        // Update Redux state
        // Temporarily commented out until updateStudentStats is properly exported
        /* dispatch(
          updateStudentStats({
            totalPoints: newTotalPoints,
            level: newLevel,
          })
        ); */

        // Update local gamification state
        setGamificationState((prev) => ({
          ...prev,
          availablePoints: newTotalPoints,
          currentLevel: newLevel,
          pointsToNextLevel: calculatePointsToNextLevel(newTotalPoints),
        }));

        // Send to backend
        await fetch("/api/students/progress", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            pointsAwarded,
            type,
            metadata,
          }),
        });

        // Check for new achievements
        await checkAchievements(newTotalPoints, type, metadata);
      } catch (error) {
        console.error("Failed to award points:", error);
      }
    },
    [user, dispatch, t]
  );

  const checkAchievements = async (
    totalPoints: number,
    actionType: string,
    metadata?: any
  ) => {
    try {
      const response = await fetch("/api/gamification/check-achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          totalPoints,
          actionType,
          metadata,
          currentStats: user && isStudent(user) ? user.stats : null,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.newAchievements && result.newAchievements.length > 0) {
          // Show achievement notifications
          result.newAchievements.forEach((achievement: Achievement) => {
            showAchievementNotification(achievement);
          });

          // Update local state
          setGamificationState((prev) => ({
            ...prev,
            earnedBadges: [...prev.earnedBadges, ...result.newBadges],
            recentAchievements: [
              ...result.newBadges,
              ...prev.recentAchievements,
            ].slice(0, 3),
          }));
        }
      }
    } catch (error) {
      console.error("Failed to check achievements:", error);
    }
  };

  const showAchievementNotification = (achievement: Achievement) => {
    toast.success(
      `${achievement.icon} ${t("achievements.newBadge")}: ${achievement.name}`,
      {
        duration: 6000,
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        },
      }
    );
  };

  const updateStreak = useCallback(async () => {
    if (!user || user.role !== "student") return;

    try {
      const response = await fetch("/api/gamification/streak", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ action: "increment" }),
      });

      if (response.ok) {
        const result = await response.json();

        // Update local state
        // Temporarily commented out until updateStudentStats is properly exported
        /* dispatch(
          updateStudentStats({
            streak: result.newStreak,
            longestStreak: result.longestStreak,
          })
        ); */

        setGamificationState((prev) => ({
          ...prev,
          currentStreak: result.newStreak,
          longestStreak: result.longestStreak,
        }));

        // Award streak points
        if (result.newStreak > 0) {
          if (result.newStreak % 7 === 0) {
            // Weekly streak bonus
            await awardPoints("weeklyStreak", 1, { streak: result.newStreak });
          } else {
            // Daily streak points
            await awardPoints("dailyStreak", 1, { streak: result.newStreak });
          }
        }

        // Show streak notification
        if (result.newStreak > 1) {
          toast.success(t("notifications.streakMaintained"), {
            icon: "🔥",
          });
        }
      }
    } catch (error) {
      console.error("Failed to update streak:", error);
    }
  }, [user, dispatch, awardPoints, t]);

  const getAchievementProgress = (achievement: Achievement): number => {
    if (!user || user.role !== "student") return 0;

    const { criteria } = achievement;
    const stats = user.stats;

    switch (criteria.type) {
      case "score":
        // This would need to be calculated based on average scores
        return Math.min(100, (stats.totalPoints / criteria.threshold) * 100);

      case "streak":
        return Math.min(100, (stats.streak / criteria.threshold) * 100);

      case "completion":
        return Math.min(
          100,
          (stats.lessonsCompleted / criteria.threshold) * 100
        );

      case "time":
        return Math.min(100, (stats.totalTimeSpent / criteria.threshold) * 100);

      case "games":
        return Math.min(100, (stats.gamesPlayed / criteria.threshold) * 100);

      default:
        return 0;
    }
  };

  const isAchievementEarned = (achievementId: string): boolean => {
    return gamificationState.earnedBadges.some(
      (badge) => badge.achievementId === achievementId
    );
  };

  const getLeaderboard = async (
    scope: "class" | "school" | "global" = "class"
  ) => {
    try {
      const response = await fetch(
        `/api/gamification/leaderboard?scope=${scope}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
    } catch (error) {
      console.error("Failed to get leaderboard:", error);
    }
    return [];
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case "common":
        return "text-gray-600";
      case "rare":
        return "text-blue-600";
      case "epic":
        return "text-purple-600";
      case "legendary":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getRarityBg = (rarity: string): string => {
    switch (rarity) {
      case "common":
        return "bg-gray-100";
      case "rare":
        return "bg-blue-100";
      case "epic":
        return "bg-purple-100";
      case "legendary":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  return {
    gamificationState,
    isLoading,
    awardPoints,
    updateStreak,
    getAchievementProgress,
    isAchievementEarned,
    getLeaderboard,
    getRarityColor,
    getRarityBg,
    calculateLevel,
    calculatePointsToNextLevel,
    POINTS_CONFIG,
    LEVEL_THRESHOLDS,
  };
};
