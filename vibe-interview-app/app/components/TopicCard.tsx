import { Link } from "react-router";
import { StarRating } from "~/components/StarRating";
import type { Score } from "~/components/FlashCard";
import { useLanguage } from "~/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";

interface TopicCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  progress?: { mastered: number; total: number };
}

export function TopicCard({ id, icon, title, description, progress }: TopicCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="hover:border-primary transition">
      <CardContent className="pt-5">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>

        {progress && progress.total > 0 && (
          <div className="mb-4 space-y-1">
            <Progress value={Math.round((progress.mastered / progress.total) * 100)} />
            <div className="flex items-center justify-end gap-1.5">
              <StarRating score={Math.round((progress.mastered / progress.total) * 3) as Score} size="sm" />
              <span className="text-[0.5rem] text-muted-foreground">
                {progress.mastered}/{progress.total}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link to={`/${id}/theory`}>{t("topicCard.theoryBtn")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/${id}/practice`}>{t("topicCard.practiceBtn")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
