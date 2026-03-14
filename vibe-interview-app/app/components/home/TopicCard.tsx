import { memo } from "react";
import { Link } from "react-router";
import { StarRating } from "~/components/shared/ui/StarRating";
import { useLanguage } from "~/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "~/components/shared/ui/card";
import { Progress } from "~/components/shared/ui/progress";
import { Button } from "~/components/shared/ui/button";
import { TopicIcon } from "~/components/shared/TopicIcon";

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  progress?: { mastered: number; total: number };
}

export const TopicCard = memo(function TopicCard({ id, title, description, progress }: TopicCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="hover:border-primary transition">
      <CardContent className="pt-5">
        <TopicIcon id={id} className="w-8 h-8 text-primary mb-3" />
        <h3 className="font-display font-bold text-lg mb-2">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {description}
        </p>

        {progress && progress.total > 0 && (
          <div className="mb-4 space-y-1">
            <Progress value={Math.round((progress.mastered / progress.total) * 100)} />
            <div className="flex items-center justify-end gap-1.5">
              <StarRating score={Math.round((progress.mastered / progress.total) * 3)} size="sm" />
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
});
